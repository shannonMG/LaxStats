import Practice from '../../models/Practice.js'; // Import the Practice model
import User from '../../models/User.js'; // Import the User model
import { AuthenticationError } from 'apollo-server-errors'; // Import Apollo error for authentication issues
import { Document, Types } from 'mongoose'; 
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

interface UpdatePlayerStatArgs {
  practiceId: string; // The ID of the practice document
  playerId: string;   // The ID of the player to update
  statName: "droppedBalls" | "completedPasses"; // Restrict to known stats
  increment: number;  // The increment value
}


interface PlayerStatsParent {
  playerId: string | { _id: string; name: string };
  droppedBalls?: number;
  completedPasses?: number;
}

interface GetPlayerStatsByIdArgs {
  practiceId: string; // Practice ID from query arguments
  playerId: string;   // Player ID from query arguments
}



// Define the resolvers for the Practice schema
const practiceResolvers = {
  Query: {
    //this gets the stats for a given player at a give practice. 
    getPlayerStatsById: async (
      _parent: unknown,
      { practiceId, playerId }: GetPlayerStatsByIdArgs
    ) => {
      try {
        // 1. Find the practice document by its ID
        const practice = await Practice.findById(practiceId);
        if (!practice) {
          throw new Error("Practice document not found.");
        }
    
        // 2. Find the player stats within the players array
        const playerStats = practice.players.find(
          (player) => player.playerId.toString() === playerId
        );
    
        if (!playerStats) {
          throw new Error("Player stats not found in this practice.");
        }
    
        // 3. Return the player's stats
        return {
          player: playerStats.playerId, // Resolve the `playerId` to the full `User` object if necessary
          droppedBalls: playerStats.droppedBalls,
          completedPasses: playerStats.completedPasses,
        };
      } catch (error) {
        console.error("Error fetching player stats:", error);
        throw new Error("Failed to fetch player stats.");
      }
    }
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
        await savedPractice.populate('players.playerId', 'name');

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
            {$inc: {'players.$.droppedBalls': droppedBalls}},
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
//This shouuld update any player stat, insetad of creating new mutaions each time we create add a statistic to track
updatePlayerStat: async (
  _parent: unknown, // Explicitly type `_parent` as `unknown`
  { practiceId, playerId, statName, increment }: UpdatePlayerStatArgs
) => {
  console.log("Received Arguments:", { practiceId, playerId, statName, increment });

  // Validate the statName
  if (!["droppedBalls", "completedPasses"].includes(statName)) {
    throw new Error("Invalid stat name");
  }

  const updatedPractice = await Practice.findOneAndUpdate(
    {
      _id: practiceId,
      "players.playerId": playerId,
    },
    {
      $inc: { [`players.$.${statName}`]: increment },
    },
    { new: true }
  );

  if (!updatedPractice) {
    console.error("No matching practice or player found:", { practiceId, playerId });
    throw new Error("Practice or player not found");
  }

  const updatedPlayer = updatedPractice.players.find(
    (p) => p.playerId.toString() === playerId
  );

  if (!updatedPlayer) {
    console.error("Player stats not found in practice:", playerId);
    throw new Error("Player stats not found in practice");
  }

  return {
    player: updatedPlayer.playerId,
    droppedBalls: updatedPlayer.droppedBalls,
    completedPasses: updatedPlayer.completedPasses,
  };
}


//SK added this for updated Completed Passes
        // updateCompletedPasses: async(_: any, { playerId, completedPasses}: PlayerStats): Promise<IPractice>=> {
        //   try{
        //     const updatedPractice=await Practice.findOneAndUpdate (
        //       {'players.playerId': playerId},
        //       {$set: { 'players.$.completedPasses': completedPasses}},
        //       {new: true}
              
  
        //     );
  
        //     if (!updatedPractice) {
        //       throw new Error('Player or Practice not found');
        //     }
        //     return updatedPractice; 
        //   } catch(error){
        //     console.error(error);
        //     throw new Error ('Failed to update completed passes')
        //   }
  
        //   }

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
}

export default practiceResolvers; // Export the resolvers
