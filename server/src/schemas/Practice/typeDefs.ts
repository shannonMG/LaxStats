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


type PlayerPracticeData {
  practiceId: ID!
  droppedBalls: Int
  completedPasses: Int
  
}

# Main Practice type
type Practice {
  id: ID!
  date: String!
  coach: ID! # Reference to the coach
  players: [PlayerStats!]! # Array of players with stats
}

type Player {
  _id: ID!
  name: String!
  stats: PlayerStats!
}


# Mutation type for creating a new practice
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


# Query type for fetching practices
# Query type for fetching practices
type Query {
  practices: [Practice!]!
  practice(id: ID!): Practice
  getPlayerStatsById(practiceId: ID!, playerId: ID!): PlayerStats!
  # Given a playerId, return all practices that the player is part of,
  # along with their stats in each.
  getPracticesForPlayer(playerId: ID!): [PlayerPracticeData!]!
}


# SK added these mutations for updated stats taking into account the playerID

 

  

  

`

export default practiceTypeDefs;