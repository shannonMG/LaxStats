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

# Type for a player
type Player {
  id: ID!
  name: String!
}

# Type for individual player stats at a practice
type PlayerStats {
  player: Player! # Reference to the player
  droppedBalls: Int
  completedPasses: Int
}


# Main Practice type
type Practice {
  id: ID!
  date: String!
  coach: ID!
  players: [PlayerStats!]! # Array of players with stats
}

# Data for a player's stats across practices
type PlayerPracticeData {
  practiceId: ID!
  date: String!
  droppedBalls: Int
  completedPasses: Int
}

# Mutation type
type Mutation {
  addPractice: Practice!
  updateDroppedBalls(playerId: ID!, droppedBalls: Int!): Practice
  updateCompletedPasses(playerId: ID!, completedPasses: Int!): Practice
  updatePlayerStat(
    practiceId: ID!,
    playerId: ID!,
    statName: String!,
    increment: Int!
  ): Practice!
}

# Query type
type Query {
  practices: [Practice!]!
  practice(id: ID!): Practice
  getPlayerStatsById(practiceId: ID!, playerId: ID!): PlayerStats!
  getPracticesForPlayer(playerId: ID!): [PlayerPracticeData!]!
}

  

  

`

export default practiceTypeDefs;