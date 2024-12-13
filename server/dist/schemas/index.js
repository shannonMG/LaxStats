import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import userTypeDefs from './User/typeDefs.js';
import userResolvers from './User/Resolvers.js';
import practiceTypeDefs from './Practice/typeDefs.js';
import practiceResolvers from './Practice/Resolvers.js';
// Combine typeDefs
const typeDefs = mergeTypeDefs([userTypeDefs, practiceTypeDefs]);
// Combine resolvers and explicitly type them
const resolvers = mergeResolvers([userResolvers, practiceResolvers]);
export { typeDefs, resolvers };
