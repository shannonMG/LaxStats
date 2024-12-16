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