import { gql } from '@apollo/client';

const AuthHelper = {
    login: gql(`
                    query login($username: String!, $password: String!) {
                        login(username: $username, password: $password){
                            response_type,
                            response,
                            username,
                            role,
                            accessToken
                        }
                    },
                `),
    guest: gql(`
                    mutation guest($username: String!){
                        guest(username: $username){
                            response_type,
                            response,
                            username,
                            role,
                            accessToken
                        }
                    }
                `),
    signup: gql(`
                    mutation register($username: String!, $email: String!, $password: String!) {
                        register(username: $username, email: $email, password: $password){
                            response_type,
                            response,
                            username,
                            role,
                            accessToken
                        }
                    }
                `),
}

export default AuthHelper;