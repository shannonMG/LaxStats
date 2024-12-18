import Practice from '../../models/Practice.js'; // Import the Practice model
import User from '../../models/User.js'; // Import the User model
import { AuthenticationError } from 'apollo-server-errors'; // Import Apollo error for authentication issues
import { Types } from 'mongoose'; // Import Mongoose types for type-checking
// Define the resolvers for the Practice schema
const practiceResolvers = {
    Query: {
        //this gets the stats for a given player at a give practice. 
        getPlayerStatsById: async (_parent, { practiceId, playerId }) => {
            try {
                // 1. Find the practice document by its ID
                const practice = await Practice.findById(practiceId);
                if (!practice) {
                    throw new Error('Practice document not found.');
                }
                // 2. Find the player stats within the players array
                const playerStats = practice.players.find((player) => player.playerId.toString() === playerId);
                if (!playerStats) {
                    throw new Error('Player stats not found in this practice.');
                }
                // 3. Return the player's stats
                return {
                    playerId: playerStats.playerId,
                    droppedBalls: playerStats.droppedBalls,
                    completedPasses: playerStats.completedPasses,
                };
            }
            catch (error) {
                console.error('Error fetching player stats:', error);
                throw new Error('Failed to fetch player stats.');
            }
        },
        getPracticesForPlayer: async (_parent, { playerId }) => {
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
            }
            catch (error) {
                console.error('Error fetching practices for player:', error);
                throw new Error('Failed to fetch practices for player.');
            }
        },
        getPractice: async (_, { id }, { Practice }) => {
            try {
                const practice = await Practice.findById(id);
                if (!practice) {
                    throw new Error("Practice not found");
                }
                return practice;
            }
            catch (error) {
                console.error("Error fetching practice:", error);
                throw new Error("Internal Server Error");
            }
        },
    },
    Mutation: {
        addPractice: async (_, __, context) => {
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
                const allPlayers = await User.find({ role: 'player' });
                // If no players are found, throw an error
                if (!allPlayers || allPlayers.length === 0) {
                    throw new Error('No players found in the database.');
                }
                // Map the list of players into a PlayerStats array with initial stats set to 0
                const playersStats = allPlayers.map((player) => ({
                    playerId: player._id, // Convert player._id (ObjectId) to a string
                    droppedBalls: 0, // Initialize droppedBalls to 0
                    completedPasses: 0, // Initialize completedPasses to 0
                }));
                // Create a new instance of the Practice model with the current date, coach ID, and player stats
                const newPractice = new Practice({
                    date: currentDate, // Set the date to the current date
                    coach: coachId, // Set the coach ID
                    players: playersStats, // Add the player stats array
                });
                // Save the new practice to the database and cast it as the IPractice type
                const savedPractice = await newPractice.save();
                // Log the saved practice for debugging purposes
                console.log('Saved Practice:', savedPractice);
                // Return the saved practice document
                return savedPractice;
            }
            catch (error) {
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
        updateDroppedBalls: async (_, { playerId, droppedBalls }) => {
            try {
                const updatedPractice = await Practice.findOneAndUpdate({ 'players.playerId': playerId }, { $inc: { 'players.$.droppedBalls': droppedBalls } }, { new: true });
                if (!updatedPractice) {
                    throw new Error('Player or practice not found');
                }
                return updatedPractice;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to update dropped balls');
            }
            ;
        },
        //This shouuld update any player stat, insetad of creating new mutaions each time we create add a statistic to track
        updatePlayerStat: async (_parent, { practiceId, playerId, statName, increment }) => {
            if (!['droppedBalls', 'completedPasses'].includes(statName)) {
                throw new Error('Invalid stat name');
            }
            const updateField = `players.$.${statName}`;
            const updatedPractice = await Practice.findOneAndUpdate({ _id: practiceId, 'players.playerId': playerId }, { $inc: { [updateField]: increment } }, { new: true });
            if (!updatedPractice) {
                throw new Error('Player or practice not found');
            }
            return updatedPractice;
        },
    },
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
};
export default practiceResolvers; // Export the resolvers
