import User from '../../models/User.js';
import { signToken, AuthenticationError } from '../../utils/auth.js';

interface User {
  _id: string;
  role: string;
  name: string;
  username: string;
  password: string;
}

interface Context {
  user?: User;
}

interface AddUserArgs {
  input: {
    name: string;
    password: string;
    role: string;
    username: string;

  }
}

interface LoginUserArgs {
  username: string;
  password: string;
}


const userResolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You must be logged in to access this data.');

    },

    users: async (_parent: any, _args: any, context: Context): Promise<User[] | null> => {
      if (context.user) {
        return await User.find({
          role: "player"
        });
      }
      throw new AuthenticationError('You must be logged in to access this data.');
    },
  },





  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, and password
      const user = await User.create({ ...input });

      // Sign a token with the user's information
      const token = signToken(user.username, user._id, user.role,);

      // Return the token and the user
      return { token, user };
    },

    login: async (_parent: any, { username, password }: LoginUserArgs) => {
      // Find a user with the provided username
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
      const token = signToken(user.username, user._id, user.role);

      // Return the token and the user
      return { token, user };
    },
  }

};

export default userResolvers;