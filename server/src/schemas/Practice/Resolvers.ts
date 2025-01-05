import Practice from '../../models/Practice.js';
import User from '../../models/User.js';
import { AuthenticationError } from 'apollo-server-errors';
import { Document, Types } from 'mongoose';

interface PlayerStats {
  playerId: Types.ObjectId;
  droppedBalls: number;
  completedPasses: number;
}

export interface IPractice extends Document {
  date: Date;
  coach: Types.ObjectId;
  players: PlayerStats[];
}

interface Context {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

interface AddPracticeArgs { }

interface UpdatePlayerStatArgs {
  practiceId: string;
  playerId: string;
  statName: "droppedBalls" | "completedPasses";
  increment: number;
}

// interface PlayerStatsParent {
//   playerId: Types.ObjectId | { _id: Types.ObjectId; name: string };
//   droppedBalls?: number;
//   completedPasses?: number;
// }

interface GetPlayerStatsByIdArgs {
  practiceId: string;
  playerId: string;
}


// interface IPlayerStats {
//     playerId: {
//         _id: string;
//         name: string;
//     };
//     stats: {
//         droppedBalls: number;
//         completedPasses: number;
//     };
// }

const practiceResolvers = {
  Query: {
      // Fetch all practices
      practices: async () => {
          try {
              const result = await Practice.find().populate(
                  'players.playerId',
                  'name'
              );
              return result.map((practice: any) => ({
                  id: practice._id.toString(),
                  date: practice.date.toISOString(),
                  players: practice.players.map((player: any) => ({
                      player: {
                          id: player.playerId._id.toString(),
                          name: player.playerId.name,
                      },
                      droppedBalls: player.droppedBalls || 0,
                      completedPasses: player.completedPasses || 0,
                  })),
              }));
          } catch (error) {
              console.error('Error fetching practices:', error);
              throw new Error('Failed to fetch practices.');
          }
      },

      // Fetch player stats by practice and player ID
      getPlayerStatsById: async (
          _parent: unknown,
          { practiceId, playerId }: GetPlayerStatsByIdArgs
      ) => {
          try {
              const practice = await Practice.findById(practiceId).populate(
                  'players.playerId',
                  'name'
              );
              if (!practice) {
                  throw new Error('Practice document not found.');
              }

              const playerStats = practice.players.find(
                  (player) => player.playerId.toString() === playerId
              );

              if (!playerStats) {
                  throw new Error(
                      'Player stats not found in this practice.'
                  );
              }

              return {
                  player: playerStats.playerId,
                  droppedBalls: playerStats.droppedBalls || 0,
                  completedPasses: playerStats.completedPasses || 0,
              };
          } catch (error) {
              console.error('Error fetching player stats:', error);
              throw new Error('Failed to fetch player stats.');
          }
      },
  },

  Mutation: {
      // Add a new practice
      addPractice: async (
          _: any,
          __: AddPracticeArgs,
          context: Context
      ): Promise<IPractice> => {
          if (!context.user || context.user.role !== 'coach') {
              throw new AuthenticationError(
                  'You must be logged in as a coach to create a practice.'
              );
          }

          const coachId = new Types.ObjectId(context.user.id);
          const currentDate = new Date();

          try {
              const allPlayers: { _id: Types.ObjectId }[] = await User.find({
                  role: 'player',
              });

              if (!allPlayers.length) {
                  throw new Error('No players found in the database.');
              }

              const playersStats: PlayerStats[] = allPlayers.map(
                  (player) => ({
                      playerId: player._id,
                      droppedBalls: 0,
                      completedPasses: 0,
                  })
              );

              const newPractice = new Practice({
                  date: currentDate,
                  coach: coachId,
                  players: playersStats,
              });

              const savedPractice = await newPractice.save();
              await savedPractice.populate('players.playerId', 'name');

              return savedPractice;
          } catch (error) {
              console.error('Error creating practice:', error);
              throw new Error('Failed to create practice.');
          }
      },

      // Update a player's stat
      updatePlayerStat: async (
          _parent: unknown,
          { practiceId, playerId, statName, increment }: UpdatePlayerStatArgs
      ) => {
          try {
              const updatedPractice = await Practice.findOneAndUpdate(
                  { _id: practiceId, 'players.playerId': playerId },
                  { $inc: { [`players.$.${statName}`]: increment } },
                  { new: true }
              ).populate({
                  path: 'players.playerId',
                  model: 'User',
              });

              if (!updatedPractice) {
                  throw new Error('Practice or player not found.');
              }

              const updatedPlayer = updatedPractice.players.find(
                  (player) => player.playerId.toString() === playerId
              );

              if (!updatedPlayer) {
                  throw new Error(
                      'Player stats not found for this practice.'
                  );
              }

              return {
                  player: updatedPlayer.playerId,
                  droppedBalls: updatedPlayer.droppedBalls || 0,
                  completedPasses: updatedPlayer.completedPasses || 0,
              };
          } catch (error) {
              console.error('Error updating player stats:', error);
              throw new Error('Failed to update player stats.');
          }
      },
  },
};

export default practiceResolvers;