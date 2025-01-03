const userTypeDefs = `#graphql
  type User {
    _id: ID!
    role: String
    name: String!
    username: String
    password: String
  }

  type Query {
    users: [User]
    me: User
}

input UserInput {
  role: String!
  name: String!
  username: String!
  password: String!
}

  
  type Auth {
    token: ID!
    user: User
  }
  
  type PlayerStats {
    player: User
    completedPasses: Int
    droppedBalls: Int
  }

  type Query {
    players: [User!]!
  }



  type Mutation {
    addUser(input: UserInput!): Auth
    login(username: String!, password: String!): Auth
}
`
export default userTypeDefs;