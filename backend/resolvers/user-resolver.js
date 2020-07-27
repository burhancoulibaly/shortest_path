const { hash, genSalt, compareSync } = require('bcrypt'),
      { createAccessToken, createRefreshToken } = require('../auth');

//graphql schema
//Query schema
//Mutation Schema
const typeDefs = `
    extend type Query {
        login(email: String!, password: String!): LoginResponse!
    }

    extend type Mutation {
        register(username: String!, f_name: String!, l_name: String!, email: String!, password: String!): LoginResponse!
    }

    type LoginResponse {
        response_type: String!
        response: String!
        email: String!
        username: String!
        accessToken: String!
    }
`;

//An object that contains mapping to get data that schema needs
const resolvers = {
    //Returns data from queries
    Query: {
        login: async(_, { email, password }, {res}) => {
            return {
                response_type: ``,
                response: ``,
                email: ``,
                username: ``,
                accessToken: ``
            }
        }
    },
    //Mutations make changes to the database
    Mutation: {
        register: async(_, { username, f_name, l_name, email, password }, {res}) => {
            return {
                response_type: ``,
                response: ``,
                email: ``,
                username: ``,
                accessToken: ``
            }
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}