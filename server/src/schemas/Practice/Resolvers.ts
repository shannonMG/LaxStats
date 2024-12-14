import Practice from '../../models/Practice.js'; // Import the Practice model
import User from '../../models/User.js'; // Import the User model
import { AuthenticationError } from 'apollo-server-errors'; // Import Apollo error for authentication issues
import { Document, Types } from 'mongoose'; // Import Mongoose types for type-checking

// Define the structure of PlayerStats: stats that belong to each player in practice
interface PlayerStats {
  playerId: Types.ObjectId;         // The ID of the player
  droppedBalls: number;     // The number of dropped balls by the player
  completedPasses: number;  // The number of completed passes by the player
}

// Define the structure of the Practice document (matches Mongoose schema)
export interface IPractice extends Document {
  date: Date;               // The date of the practice
  coach: Types.ObjectId;    // The ID of the coach
  players: PlayerStats[];   // An array of PlayerStats for each player
}

// Define the structure of the Context passed into the resolver
interface Context {
  user?: {
    id: string;             // The ID of the user (from the JWT context)
    username: string;       // The username of the user
    role: string;           // The role of the user (coach or player)
  };
}

// Define the arguments for the addPractice mutation (empty in this case)
interface AddPracticeArgs {}

interface PlayerStatsArgs {
  practiceId: string; // The ID of the practice document
  playerId: string;   // The ID of the player to find stats for
}

// Define the resolvers for the Practice schema
const practiceResolvers = {
  Query: {
    getPlayerStatsById: async (_parent: any, { practiceId, playerId }: PlayerStatsArgs) => {
      try {
        // 1. Find the practice document by its ID
        const practice = await Practice.findById(practiceId);
        if (!practice) {
          throw new Error('Practice document not found.');
        }

        // 2. Find the player stats within the players array
        const playerStats = practice.players.find(
          (player) => player.playerId.toString() === playerId
        );

        if (!playerStats) {
          throw new Error('Player stats not found in this practice.');
        }

        // 3. Return the player's stats
        return {
          playerId: playerStats.playerId,
          droppedBalls: playerStats.droppedBalls,
          completedPasses: playerStats.completedPasses,
        };
      } catch (error) {
        console.error('Error fetching player stats:', error);
        throw new Error('Failed to fetch player stats.');
      }
    },

  },
  
  Mutation: {
    addPractice: async (_: any, __: AddPracticeArgs, context: Context): Promise<IPractice> => {
      try {
        // Log the current user context to confirm the user is authenticated
        console.log('Context user:', context.user, context.user?.role);

        // Check if the user is authenticated and has the 'coach' role
        if (!context.user || context.user.role !== 'coach') {
          throw new AuthenticationError('You must be logged in as a coach to create a practice.');
        }

        // Extract the coach ID from the authenticated user
        const coachId = new Types.ObjectId(context.user.id); // Ensure it's a valid ObjectId

        // Create a new date object representing the current date and time
        const currentDate = new Date();

        // Fetch all users with the role of 'player' from the database
        const allPlayers = await User.find({ role: 'player' }) as Array<{_id:Types.ObjectId }>;

        // If no players are found, throw an error
        if (!allPlayers || allPlayers.length === 0) {
          throw new Error('No players found in the database.');
        }

        // Map the list of players into a PlayerStats array with initial stats set to 0
        const playersStats: PlayerStats[] = allPlayers.map((player) => ({
          playerId: player._id, // Convert player._id (ObjectId) to a string
          droppedBalls: 0,                 // Initialize droppedBalls to 0
          completedPasses: 0,              // Initialize completedPasses to 0
        }));

        // Create a new instance of the Practice model with the current date, coach ID, and player stats
        const newPractice = new Practice({
          date: currentDate,   // Set the date to the current date
          coach: coachId,      // Set the coach ID
          players: playersStats, // Add the player stats array
        });

        // Save the new practice to the database and cast it as the IPractice type
        const savedPractice = await newPractice.save() as IPractice;

        // Log the saved practice for debugging purposes
        console.log('Saved Practice:', savedPractice);

        // Return the saved practice document
        return savedPractice;
      } catch (error) {
        // Handle errors by checking if the error is an instance of Error
        if (error instanceof Error) {
          console.error('Error details:', error.message); // Log the error message
          throw new Error(`Error creating practice: ${error.message}`); // Throw a meaningful error
        }
        // Handle unexpected errors
        throw new Error('Error creating practice: Unknown error occurred.');
      }
    },
    
  },
};

export default practiceResolvers; // Export the resolvers
