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
  query GetPlayerStatsById($practiceId: ID!, $playerId: ID!) {
  getPlayerStatsById(practiceId: $practiceId, playerId: $playerId) {
    completedPasses
    droppedBalls
  }
}
`

// need to add more queries

export const GET_PRACTICE = gql`
  query GetPractice($practiceId: ID!) {
    practice(id: $practiceId) {
      id
      date
      players {
        completedPasses
        droppedBalls
        player {
          _id
          name
        }
      }
    }
  }
`;

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
query GetAllPractices {
  practices {
    coach
    date
    id
    date
    coach
    players {
      completedPasses
      droppedBalls
      player {
        _id
        name
      }
      droppedBalls
      completedPasses
    }
  }
}
`;