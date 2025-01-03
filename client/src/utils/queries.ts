import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query Query {
        me {
            _id
            name
            password
            role
            username
        },

    }
`;

export const GET_PLAYER_STATS = gql`
    query Query($practiceId: ID!, $playerId: ID!) {
        getPlayerStatsById(practiceId: $practiceId, playerId: $playerId) {
            completedPasses
            droppedBalls
            playerId
  }
}
`

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

export const QUERY_PRACTICES_FOR_COACH=gql`
query Query {
  practices {
    coach
    date
    id
    players {
      player {
        _id
        name
      }
    }
  }
}
`