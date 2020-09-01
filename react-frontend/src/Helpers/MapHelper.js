import { gql } from '@apollo/client';

const Map = {
    saveMap: gql(`
                mutation saveMap($username: String!, $map: [SquareObject!]) {
                    saveMap(username: $username, map: $map){
                        response_type,
                        response
                    }
                },
            `),
    getUsersMaps: gql(`
                query getUsersMaps($username: String!) {
                    getUsersMaps(username: $username){
                        name,
                        map{
                            val,
                            type,
                            x,
                            y
                        },
                        highscore_one,
                        highscore_two,
                        highscore_three
                    }
                },
            `),
}

export default Map;