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

interface PlayerStatsParent {
  playerId: Types.ObjectId | { _id: Types.ObjectId; name: string };
  droppedBalls?: number;
  completedPasses?: number;
}

interface GetPlayerStatsByIdArgs {
  practiceId: string;
  playerId: string;
}

const practiceResolvers = {
  Query: {
    // Fetch player stats by practice and player ID
    getPlayerStatsById: async (
      _parent: unknown,
      { practiceId, playerId }: GetPlayerStatsByIdArgs
    ) => {
      try {
        const practice = await Practice.findById(practiceId).populate('players.playerId', 'name');
        if (!practice) {
          throw new Error("Practice document not found.");
        }

        const playerStats = practice.players.find(
          (player) => player.playerId.toString() === playerId
        );

        if (!playerStats) {
          throw new Error("Player stats not found in this practice.");
        }

        return {
          player: playerStats.playerId,
          droppedBalls: playerStats.droppedBalls,
          completedPasses: playerStats.completedPasses,
        };
      } catch (error) {
        console.error("Error fetching player stats:", error);
        throw new Error("Failed to fetch player stats.");
      }
    },

    practices: async () => {
      try {
        return await Practice.find().populate('players.playerId', 'name');
      } catch (error) {
        console.error("Error fetching practices:", error);
        throw new Error("Failed to fetch practices.");
      }
    },

    practice: async (_: any, { id }: { id: string }) => {
      try {
        const practice = await Practice.findById(id).populate('players.playerId', 'name');
        if (!practice) {
          throw new Error("Practice not found.");
        }
        return practice;
      } catch (error) {
        console.error("Error fetching practice:", error);
        throw new Error("Failed to fetch practice.");
      }
    },
  },

  PlayerStats: {
    player: async (parent: PlayerStatsParent) => {
      if (typeof parent.playerId === 'object' && '_id' in parent.playerId) {
        return parent.playerId;
      }
      return await User.findById(parent.playerId).select('name');
    },
  },

  Mutation: {
    // Add a new practice
    addPractice: async (_: any, __: AddPracticeArgs, context: Context): Promise<IPractice> => {
      // Ensure the user is authenticated and has the 'coach' role
      if (!context.user || context.user.role !== 'coach') {
        throw new AuthenticationError('You must be logged in as a coach to create a practice.');
      }
    
      const coachId = new Types.ObjectId(context.user.id); // Convert user ID to ObjectId
      const currentDate = new Date();
    
      try {
        // Fetch all players with the role of 'player'
        const allPlayers: { _id: Types.ObjectId }[] = await User.find({ role: 'player' });
    
        if (!allPlayers.length) {
          throw new Error('No players found in the database.');
        }
    
        // Create initial stats for all players
        const playersStats: PlayerStats[] = allPlayers.map((player) => ({
          playerId: player._id,
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
        const savedPractice = await newPractice.save();
    
        // Populate player names in the saved practice
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
      if (!["droppedBalls", "completedPasses"].includes(statName)) {
        throw new Error("Invalid stat name.");
      }

      try {
        console.log("Querying Practice with:", { practiceId, playerId });
        const updatedPractice = await Practice.findOneAndUpdate(
          { _id: practiceId, "players.playerId": playerId },
          { $inc: { [`players.$.${statName}`]: increment } },
          { new: true }
        ).populate('players.playerId', 'name');

        if (!updatedPractice) {
          throw new Error("Practice or player not found.");
        }

        const updatedPlayer = updatedPractice.players.find(
          (player) => player.playerId.toString() === playerId
        );

        if (!updatedPlayer) {
          throw new Error("Player stats not found in practice.");
        }

        return {
          player: updatedPlayer.playerId,
          droppedBalls: updatedPlayer.droppedBalls,
          completedPasses: updatedPlayer.completedPasses,
        };
      } catch (error) {
        console.error("Error updating player stats:", error);
        throw new Error("Failed to update player stats.");
      }
    },
  },
};

export default practiceResolvers;
