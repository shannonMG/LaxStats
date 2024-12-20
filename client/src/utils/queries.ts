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