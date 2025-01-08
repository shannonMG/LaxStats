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
  date: Date; // <-- Must match what Mongoose actually stores
  players: PlayerStats[];// An array of PlayerStats for each player
}

// Define the structure of the Context passed into the resolver
interface UserContext {
  _id: string; // Include `_id`
  username: string;
  role: string;
}

interface Context {
  user: UserContext;
}


// Define the arguments for the addPractice mutation (empty in this case)
interface AddPracticeArgs { }

interface PlayerStatsArgs {
  practiceId: string; // The ID of the practice document
  playerId: string;   // The ID of the player to find stats for
}

interface UpdatePlayerStatArgs {
  practiceId: string;    // The practice ID will typically be a string; GraphQL IDs map to strings in TS
  playerId: string;      // The player ID will also typically be a string
  statName: 'droppedBalls' | 'completedPasses'; // Restrict to known stat names if desired
  increment: number;     // The increment is an integer to add or subtract
}

interface PlayerStatsParent {
  playerId: string | { _id: string; name: string };
  droppedBalls?: number;
  completedPasses?: number;
}




// Define the resolvers for the Practice schema
const practiceResolvers = {
  Query: {
    //this gets the stats for a given player at a give practice. 
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
    
        // 3. Return only the player's stats
        return {
          droppedBalls: playerStats.droppedBalls,
          completedPasses: playerStats.completedPasses,
        };
      } catch (error) {
        console.error('Error fetching player stats:', error);
        throw new Error('Failed to fetch player stats.');
      }
    },
    
    
    
    getPracticesForPlayer: async (_parent: any, { playerId }: { playerId: string }) => {
      try {
        // Find all practices that this player is part of
        const playerPractices = await Practice.find({ 'players.playerId': playerId });
    
        // If no practices are found, you can decide what to return:
        if (!playerPractices || playerPractices.length === 0) {
          return []; // return an empty array, or you could throw an error
        }
    
        // Return an array of practices, possibly including the player's specific stats
        return playerPractices.map((practice) => {
          const playerStats = practice.players.find((player) => player.playerId.toString() === playerId);

        if (!playerStats) {
          throw new Error('Player stats not found.');
        }

        // Now `playerStats` is guaranteed to be defined.
        return {
          practiceId: practice._id,
          droppedBalls: playerStats.droppedBalls,
          completedPasses: playerStats.completedPasses,
        };
        });
      } catch (error) {
        console.error('Error fetching practices for player:', error);
        throw new Error('Failed to fetch practices for player.');
      }
    },
    
  
    getPracticesByCoach: async (_parent: any, { coachId }: { coachId: string }) => {
      try {
        console.log('Fetching practices for coach ID:', coachId);
    
        // Query practices and populate player data
        const practices = await Practice.find({ coach: coachId }).populate({
          path: 'players.playerId',
          select: 'name', // Only include the name field
        });
    
        console.log('Practices fetched:', practices);
    
        if (!practices || practices.length === 0) {
          console.error('No practices found for coach ID:', coachId);
          throw new Error('No practices found for this coach.');
        }
    
        return practices;
      } catch (error) {
        console.error('Error in getPracticesByCoach:', error);
        throw new Error('Failed to fetch practices for this coach.');
      }
    },
    
},
  


  PlayerStats: {
      // Mark the param type:
      player: async (
        parent: PlayerStatsParent,
      ) => {
        // Now TypeScript won't complain about `parent` being implicitly any
        return parent.playerId;
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
        const coachId = context.user._id; // Convert `id` to ObjectId

        console.log('Coach ID:', coachId);
        // Create a new date object representing the current date and time
        const currentDate = new Date();

        // Fetch all users with the role of 'player' from the database
        const allPlayers = await User.find({ role: 'player' }) as Array<{ _id: Types.ObjectId }>;

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
          coach: coachId,     // Set the coach ID
          players: playersStats, // Add the player stats array
        });

        // Save the new practice to the database and cast it as the IPractice type
        const savedPractice = await newPractice.save();
        // await savedPractice.populate('players.playerId', 'name');
        const populatedPractice = await Practice.findById(savedPractice._id).populate({
          path: 'players.playerId', // Populate the playerId references in players
          select: 'name', // Only include the `name` field in the response
        });

        if (!populatedPractice) {
          throw new Error('Practice not found after creation.'); // Handle this gracefully
        }

        // Return the saved practice document
        return populatedPractice;
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

    updatePlayerStat: async (_parent: unknown,{ practiceId, playerId, statName, increment }: UpdatePlayerStatArgs ) => {
          if (!['droppedBalls', 'completedPasses'].includes(statName)) {
            throw new Error('Invalid stat name');
          }

          const updateField = `players.$.${statName}`;

          const updatedPractice = await Practice.findOneAndUpdate(
            { _id: practiceId, 'players.playerId': playerId },
            { $inc: { [updateField]: increment } },
            { new: true }
          );

          if (!updatedPractice) {
            throw new Error('Player or practice not found');
          }
          const populatedPractice = await Practice.findById(updatedPractice._id).populate({
              path: 'players.playerId', // Populate the playerId reference
              select: 'name', // Only include the `name` field from the User model
            });

            if (!populatedPractice) {
              throw new Error('Updated practice not found after population');
            }

            return populatedPractice;
          },
            },
          };
        

export default practiceResolvers; // Export the resolvers
