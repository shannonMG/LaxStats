import User from '../models/User.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        me: async (_parent, _args, context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
        },
    },
    Mutation: {
        addUser: async (_parent, { input }) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            // Sign a token with the user's information
            const token = signToken(user.username, user._id);
            // Return the token and the user
            return { token, user };
        },
        login: async (_parent, { username, password }) => {
            // Find a user with the provided email
            const user = await User.findOne({ username });
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('Could not authenticate user.');
            }
            // Sign a token with the user's information
            const token = signToken(user.username, user._id);
            // Return the token and the user
            return { token, user };
        },
    }
};
export default resolvers;
