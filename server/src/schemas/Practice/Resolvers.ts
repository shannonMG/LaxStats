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
interface AddPracticeArgs { }

// Define the resolvers for the Practice schema
const practiceResolvers = {
  Query: {
    // practices: async (_parent: any, _args: any, context: Context): Promise<Practice[] | null> => {
    //   if (context.user) {
    //     return await Practice.find();
    //   }
    //   throw new AuthenticationError('You must be logged in to access this data.');
    // },

    // practice: async (_parent: any, args: { practiceId: String}, context: Context): Promise<Practice | null> => {
    //   if (context.user) {
    //     return await Practice.findById(practiceId);
    //   }
    //   throw new AuthenticationError('You must be logged in to access this data.');
    // },


    // getPlayerStats: (args: practiceId) <--- if player wants to see their own stats

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

      // SK adding this for stats updates
      updateDroppedBalls: async(_: any, { playerId, droppedBalls}: PlayerStats): Promise<IPractice>=> {
        try{
          const updatedPractice=await Practice.findOneAndUpdate (
            {'players.playerId': playerId},
            {$set: {'players.$.droppedBalls': droppedBalls}},
            {new: true}
            

          );

          if (!updatedPractice) {
            throw new Error('Player or practice not found');
          }
          return updatedPractice; 
        } catch(error){
          console.error(error);
          throw new Error ('Failed to update dropped balls');
        };

        },
//SK added this for updated Completed Passes
        updateCompletedPasses: async(_: any, { playerId, completedPasses}: PlayerStats): Promise<IPractice>=> {
          try{
            const updatedPractice=await Practice.findOneAndUpdate (
              {'players.playerId': playerId},
              {$set: { 'players.$.completedPasses': completedPasses}},
              {new: true}
              
  
            );
  
            if (!updatedPractice) {
              throw new Error('Player or Practice not found');
            }
            return updatedPractice; 
          } catch(error){
            console.error(error);
            throw new Error ('Failed to update completed passes')
          }
  
          }

    // updatePractice: (args: newPlayerArray)
    // Practice.findAndUpdate({ $set: {players: newPlayersArray}})


    // addPlayerToPractice: (args: practiceId, playerId)
    // Practice.findAndUpdate({$addToSet: { players: playerId} })

    // updateStats : (args: practiceId, playerId, newDroppedBalls, newCompletedPasses)
    /* 
      const targetPractice = Practice.find(practiceId);

      const updatedPlayers = targetPractice.players.map(player => {
          if(player.playerId == playerId) {
            return {
              ...player,
              droppedBalls: newDroppedBalls,
              completedPasses: newCompletedPasses
            }
          } else {
            return player; 
          }
      })

     Practice.findAndUpdate({$set: { players: updatedPlayers} })

    */
  },
};

export default practiceResolvers; // Export the resolvers
