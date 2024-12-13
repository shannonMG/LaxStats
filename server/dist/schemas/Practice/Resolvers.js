import Practice from '../../models/Practice.js'; // Import the Practice model
import User from '../../models/User.js'; // Import the User model
import { AuthenticationError } from 'apollo-server-errors'; // Import Apollo error for authentication issues
import { Types } from 'mongoose'; // Import Mongoose types for type-checking
// Define the resolvers for the Practice schema
const practiceResolvers = {
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
    },
};
export default practiceResolvers; // Export the resolvers
