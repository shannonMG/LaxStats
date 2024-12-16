import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation Mutation($input: UserInput!) {
        addUser(input: $input) {
            token
        }
    }
`;

export const LOGIN_USER = gql `
    mutation Mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            token
        }
    }
`;


// need to add an ADD_PRACTICE mutation