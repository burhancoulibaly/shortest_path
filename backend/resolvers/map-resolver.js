const typeDefs = `
    extend type Query {
        getUserMap(mapId: String!): Map!
        getUsersMaps(username: String!): [Map!]
        getAllUserMaps: [Map!]
        get10PathsMaps: [Map!]
    }

    extend type Mutation {
        saveMap(username: String!, map: [[Int!]]): Response!
    }

    type Map {
        map: [[Int!]]
        highscore_one: String!
        highscore_two: String!
        highscore_three: String!
    }
`;

const resolvers = {
    Query: {
        getUserMap: async(_, { mapId }, { req }) => {
            return {
                map: [],
                highscore_one: ``,
                highscore_two: ``,
                highscore_three: ``
            }
        },
        getUsersMaps: async(_, { username }, { req }) => {
            return {
                map: [],
                highscore_one: ``,
                highscore_two: ``,
                highscore_three: ``
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
            return {
                response_type: ``,
                response: ``,
            }
        }
    }
};

module.exports = {
    typeDefs,
    resolvers
}