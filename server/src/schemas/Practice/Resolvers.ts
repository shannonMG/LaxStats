import Practice from '../../models/Practice.js';
import User from '../../models/User.js';
import { AuthenticationError } from 'apollo-server-errors';
import { Document, Types } from 'mongoose';


export interface IPlayer {
  _id: string;
  name: string;
}


interface PlayerStats {
  playerId: Types.ObjectId | IPlayer
  droppedBalls: number;
  completedPasses: number;
}



export interface IPractice extends Document {
  _id: string;
  date: Date;
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

// interface UpdatePlayerStatArgs {
//   practiceId: string;
//   playerId: string;
//   statName: "droppedBalls" | "completedPasses";
//   increment: number;
// }

interface GetPlayerStatsByIdArgs {
  practiceId: string;
  playerId: string;
}

interface PlayerStatsParent {
  playerId: Types.ObjectId | { _id: Types.ObjectId; name: string };
  droppedBalls: number;
  completedPasses: number;
}

const practiceResolvers = {
  PlayerStats: {
    player: async (parent: PlayerStatsParent) => {
      if (typeof parent.playerId === 'object' && '_id' in parent.playerId) {
        return parent.playerId; // Already populated
      }
      const user = await User.findById(parent.playerId).select('name');
      return user ? { _id: user._id, name: user.name } : null;
    },
  },

  Query: {
    // Fetch all practices
<<<<<<< HEAD
    practices: async (): Promise<IPractice[]> => {
      try {
        // Fetch practices and populate `playerId`
        const result = await Practice.find().populate('players.playerId', 'name');
    
        return result.map((practice) => ({
          _id: practice._id.toString(),
          date: practice.date,
          players: practice.players.map((player) => ({
            playerId: player.playerId && typeof player.playerId === 'object'
              ? {
                  _id: (player.playerId as IPlayer)._id.toString(),
                  name: (player.playerId as IPlayer).name || null,
                }
              : (player.playerId as Types.ObjectId),
=======
    practices: async () => {
      try {
        const result = await Practice.find().populate('players.playerId', 'name');
        return result.map((practice: any) => ({
          id: practice._id.toString(),
          date: practice.date.toISOString(),
          players: practice.players.map((player: any) => ({
            playerId: player.playerId, // Fixed to directly assign playerId
>>>>>>> 66d20ef0d6156ba45b7acf71cfe58b481eea870a
            droppedBalls: player.droppedBalls || 0,
            completedPasses: player.completedPasses || 0,
          })),
        }));
      } catch (error) {
        console.error('Error fetching practices:', error);
        throw new Error('Failed to fetch practices.');
      }
<<<<<<< HEAD
    };
    
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
          (player) => player.player.toString() === playerId
        );

        if (!playerStats) {
          throw new Error('Player stats not found in this practice.');
        }

        return {
          player: playerStats.player,
=======
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
          throw new Error('Player stats not found in this practice.');
        }

        return {
          player: playerStats.playerId,
>>>>>>> 66d20ef0d6156ba45b7acf71cfe58b481eea870a
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
      ): Promise<{
        _id: string;
        date: string;
        coach: Types.ObjectId;
        players: {
          player: { id: string; name: string | null };
          droppedBalls: number;
          completedPasses: number;
        }[];
      }> => {
        if (!context.user || context.user.role !== 'coach') {
          throw new AuthenticationError(
            'You must be logged in as a coach to create a practice.'
          );
        }
      
        const coachId = new Types.ObjectId(context.user.id);
        const currentDate = new Date();
      
        try {
          // Fetch all players with the role of 'player'
          const allPlayers = await User.find({ role: 'player' }).select('_id name');
      
          if (!allPlayers.length) {
            throw new Error('No players found in the database.');
          }
      
          // Create initial stats for all players
          const playersStats: PlayerStats[] = allPlayers.map((player) => ({
            playerId: player._id as Types.ObjectId,
            droppedBalls: 0,
            completedPasses: 0,
          }));
      
          // Create a new practice document
          const newPractice = new Practice({
            date: currentDate,
            coach: coachId,
            players: playersStats,
          });
      
          // Save the practice to the database
          const savedPractice: IPractice = await newPractice.save();
      
          // Populate player names in the saved practice
          await savedPractice.populate('players.playerId', 'name');
      
          // Return the response, including player names
          return {
            _id: savedPractice.id.toString(),
            date: savedPractice.date.toString(),
            coach: savedPractice.coach,
            players: savedPractice.players.map((player) => ({
              player: {
                id: (player.playerId as any)._id.toString(),
                name: (player.playerId as any).name || null,
              },
              droppedBalls: player.droppedBalls,
              completedPasses: player.completedPasses,
            })),
          };
        } catch (error) {
          console.error('Error creating practice:', error);
          throw new Error('Failed to create practice.');
        }
      },
      

    // Update a player's stat
//     updatePlayerStat: async (
//       _parent: unknown,
//       { practiceId, playerId, statName, increment }: UpdatePlayerStatArgs
//     ) => {
//       try {
//         const updatedPractice = await Practice.findOneAndUpdate(
//           { _id: practiceId, 'players.playerId': playerId },
//           { $inc: { [`players.$.${statName}`]: increment } },
//           { new: true }
//         ).populate({
//           path: 'players.playerId',
//           model: 'User',
//         });

//         if (!updatedPractice) {
//           throw new Error('Practice or player not found.');
//         }

//         const updatedPlayer = updatedPractice.players.find(
//           (player) => player.playerId.toString() === playerId
//         );

//         if (!updatedPlayer) {
//           throw new Error('Player stats not found for this practice.');
//         }

//         return {
//           player: updatedPlayer.playerId,
//           droppedBalls: updatedPlayer.droppedBalls || 0,
//           completedPasses: updatedPlayer.completedPasses || 0,
//         };
//       } catch (error) {
//         console.error('Error updating player stats:', error);
//         throw new Error('Failed to update player stats.');
//       }
//     },
//   },
},
}

export default practiceResolvers;
