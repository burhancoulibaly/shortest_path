import { gql } from '@apollo/client';

const Map = {
    saveMap: gql(`
                mutation saveMap($username: String!, $mapName: String!, $map: [SquareObject!]) {
                    saveMap(username: $username, mapName: $mapName, map: $map){
                        response_type,
                        response
                    }
                },
            `),
    editMap: gql(`
                mutation editMap($username: String!, $mapNameOrig: String!, $mapNameEdit: String!, $map: [SquareObject!]) {
                    editMap(username: $username, mapNameOrig: $mapNameOrig, mapNameEdit: $mapNameEdit, map: $map){
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