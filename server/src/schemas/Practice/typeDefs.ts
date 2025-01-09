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
  players: [PlayerStatsInput!]!
}

# Type for individual player stats at a practice
type PlayerStats {
  player: User       # Notice we use 'player' instead of 'playerId'
  droppedBalls: Int
  completedPasses: Int
}



type PlayerPracticeData {
  practiceId: ID!
  droppedBalls: Int
  completedPasses: Int
  # include the date as well (to better reference)
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
  updatePlayerStat(
    practiceId: ID!,
    playerId: ID!,
    statName: String!,
    increment: Int!
  ): Practice!
}

# Query type for fetching practices
type Query {
  practices: [Practice]
  practice(id: ID!): Practice
  getPlayerStatsById(practiceId: ID!, playerId: ID!): PlayerStats!
  # Given a playerId, return all practices that the player is part of,
  # along with their stats in each.
  getPracticesForPlayer(playerId: ID!): [PlayerPracticeData!]!
  getPracticesByCoach(coachId: ID!): [Practice!]!
}




# SK added these mutations for updated stats taking into account the playerID

 

  

  

`

export default practiceTypeDefs;