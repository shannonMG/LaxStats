import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query Query {
        me {
            _id
            name
            password
            role
            username
        }
    }
`;

// need to add more queries

export const QUERY_PRACTICES=gql`
query GetPracticesForPlayer($playerId: ID!) {
  getPracticesForPlayer(playerId: $playerId) {
    completedPasses
    droppedBalls
    practiceId
  }
}


`