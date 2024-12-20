import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation Mutation($input: UserInput!) {
        addUser(input: $input) {
            token
            user {
                _id
                name
                password
                role
                username
            }
        }
    }
`;

export const LOGIN_USER = gql `
    mutation Mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
            user {
                _id
                name
                password
                role
                username
            }
        }
    }
`;

export const UPDATE_PLAYER_STAT = gql ` 
  mutation Mutation($practiceId: ID!, $playerId: ID!, $statName: String!, $increment: Int!) {
  updatePlayerStat(practiceId: $practiceId, playerId: $playerId, statName: $statName, increment: $increment) {
    id
    date
    coach
    players {
      playerId
      droppedBalls
      completedPasses
    }
  }
}
`;


// need to add an ADD_PRACTICE mutation