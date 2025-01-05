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


type PlayerStats {
  player: Player! # Reference to the player
  droppedBalls: Int
  completedPasses: Int
}



type Practice {
  id: ID!
  date: String!
  coach: ID!
  players: [PlayerStats!]! # Array of players with stats
}

type PlayerPracticeData {
  practiceId: ID!
  date: String!
  droppedBalls: Int
  completedPasses: Int
}
enum StatName {
  droppedBalls
  completedPasses
}

type Query {
    practices: [Practice!]!
    getPlayerStatsById(practiceId: ID!, playerId: ID!): PlayerStats!
}

type Mutation {
  addPractice: Practice!
  a
    updatePlayerStat(
        practiceId: ID!
        playerId: ID!
        statName: String!
        increment: Int!
    ): PlayerStats!
}

  

  

`

export default practiceTypeDefs;