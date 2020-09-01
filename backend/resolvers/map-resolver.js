const { createAccessToken, createRefreshToken } = require('../auth'),
      db = require('../db');
const { map } = require('lodash');
      
const typeDefs = `
    extend type Query {
        getUserMap(mapId: String!): Map!
        getUsersMaps(username: String!): [Map!]
        getAllUserMaps: [Map!]
        get10PathsMaps: [Map!]
    }

    extend type Mutation {
        saveMap(username: String!, map: [SquareObject!]): Response!
    }

    input SquareObject {
        val: Boolean!
        type: String
        x: Int!
        y: Int!
    }
    
    type Square {
        val: Boolean!
        type: String
        x: Int!
        y: Int!
    } 
    
    type Map {
        name: String!
        map: [Square]!
        highscore_one: String
        highscore_two: String
        highscore_three: String
    }
`;

const resolvers = {
    Query: {
        getUserMap: async(_, { mapId }, { req }) => {
            return {
                map: {
                    val: false,
                    type: ``,
                    x: 0,
                    y: 0
                },
                highscore_one: ``,
                highscore_two: ``,
                highscore_three: ``
            }
        },
        getUsersMaps: async(_, { username }, { req }) => {
            try {
                const maps = await db.getUsersMaps(username);

                return maps;
            } catch (error) {
                console.log(error);

                throw error;
            }
        },
        getAllUserMaps: async(_, data, { req }) => {
            return {
                map: [],
                highscore_one: ``,
                highscore_two: ``,
                highscore_three: ``
            }
        },
        get10PathsMaps: async(_, data, { req }) => {
            return {
                map: [],
                highscore_one: ``,
                highscore_two: ``,
                highscore_three: ``
            }
        },
    },
    Mutation: {
        saveMap: async(_, { username, map }, {req}) => {
            try { 
                response = await db.saveMap(username, map); 

                return {
                    response_type: `Success`,
                    response: `${response}`,
                }
            } catch (error) {
                return {
                    response_type: error.toString().split(":")[0].replace(" ",""),
                    response: error.toString().split(":")[1].replace(" ",""),
                }
            }      
        }
    }
};

module.exports = {
    typeDefs,
    resolvers
}