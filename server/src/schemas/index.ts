import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { IResolvers } from '@graphql-tools/utils';

import userTypeDefs from './User/typeDefs.js';
import userResolvers from './User/Resolvers.js';

import practiceTypeDefs from './Practice/typeDefs.js';
import practiceResolvers from './Practice/Resolvers.js';

// Combine typeDefs
const typeDefs = mergeTypeDefs([userTypeDefs, practiceTypeDefs]);

// Combine resolvers and explicitly type them
const resolvers: IResolvers = mergeResolvers([userResolvers, practiceResolvers]) as IResolvers;

export { typeDefs, resolvers };
