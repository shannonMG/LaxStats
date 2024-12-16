const practiceTypeDefs = `#graphql
# Input type for individual player stats at a practice
input PlayerStatsInput {
  playerId: ID!
  droppedBalls: Int!
  completedPasses: Int!
}

# Input type for creating a new practice
input PracticeInput {
  date: String!
  coach: ID!
  players: [PlayerStatsInput!]!
}

# Type for individual player stats at a practice
type PlayerStats {
  playerId: ID!
  droppedBalls: Int!
  completedPasses: Int!
}

# Main Practice type
type Practice {
  id: ID!
  date: String!
  coach: ID! # Reference to the coach
  players: [PlayerStats!]! # Array of players with stats
}



# Mutation type for creating a new practice
type Mutation {
  addPractice: Practice!
  updateDroppedBalls(playerId: ID!, droppedBalls: Int!): Practice
  updateCompletedPasses(playerId: ID!, completedPasses: Int!): Practice
}

# Query type for fetching practices
type Query {
  practices: [Practice!]!
  practice(id: ID!): Practice
  getPlayerStatsById(practiceId: ID!, playerId: ID!): PlayerStats!
}

# SK added these mutations for updated stats taking into account the playerID

 

  

  

`;
export default practiceTypeDefs;
