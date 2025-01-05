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

  getPracticesForPlayer: async (_: any, __: any, { user }: Context) => {
    if (!user || user.role !== "player") {
      throw new AuthenticationError("You must be logged in as a player to view your practices.");
    }
    try {
      const practices = await Practice.find({
        "players.playerId": user.id, // Filter practices containing the player's ID
      }).populate("players.playerId", "name");
  
      // If no practices are found, return an empty array
      if (!practices || practices.length === 0) {
        return []; // Ensure an empty array is returned
      }
  
      // Filter the player's stats for each practice
      const filteredPractices = practices.map((practice) => ({
        id: practice._id,
        date: practice.date,
        players: practice.players.filter(
          (player) => player.playerId.toString() === user.id
        ),
      }));
  
      return filteredPractices;
    } catch (error) {
      console.error("Error fetching practices for player:", error);
      throw new Error("Failed to fetch practices.");
    }
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
    updatePlayerStat: async (_parent: unknown, { practiceId, playerId, statName, increment }: UpdatePlayerStatArgs) => {
      console.log("Received input:", { practiceId, playerId, statName, increment });
    
      if (!["droppedBalls", "completedPasses"].includes(statName)) {
        console.error("Invalid stat name:", statName);
        throw new Error("Invalid stat name.");
      }
    
      try {
        console.log("Finding and updating practice...");
        const updatedPractice = await Practice.findOneAndUpdate(
          { _id: practiceId, "players.playerId": playerId },
          { $inc: { [`players.$.${statName}`]: increment } },
          { new: true }
        ).populate({
          path: "players.playerId",
          model: "User",
        });
    
        if (!updatedPractice) {
          console.error("Practice or player not found.");
          throw new Error("Practice or player not found.");
        }
    
        console.log("Updated practice:", updatedPractice);
    
        const updatedPlayer = updatedPractice.players.find(
          (player) => player.playerId.toString() === playerId
        );
    
        if (!updatedPlayer) {
          console.error("Player stats not found for playerId:", playerId);
          throw new Error("Player stats not found in practice.");
        }
    
        console.log("Updated player stats:", updatedPlayer);
    
        return {
          player: updatedPlayer.playerId,
          droppedBalls: updatedPlayer.droppedBalls || 0,
          completedPasses: updatedPlayer.completedPasses || 0,
        };
      } catch (error) {
        console.error("Error updating player stats:", error);
        throw new Error("Failed to update player stats.");
      }
    }
    
},
}

export default practiceResolvers;
