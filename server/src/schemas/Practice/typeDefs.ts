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
}

# Query type for fetching practices
type Query {
  practices: [Practice!]!
  practice(id: ID!): Practice
}
`

export default practiceTypeDefs;