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
    deleteMap: gql(`
                mutation deleteMap($username: String!, $mapName: String!) {
                    deleteMap(username: $username, mapName: $mapName){
                        response_type,
                        response
                    }
                },
            `),
    getUserMap: gql(`
                query getUserMap($mapName: String!) {
                    getUserMap(mapName: $mapName) {
                        owner,
                        name,
                        map{
                            val,
                            type,
                            x,
                            y
                        },
                        highest_score,
                        second_highest_score,
                        third_highest_score,
                    }
                }

            `),
    getUsersMaps: gql(`
                query getUsersMaps($username: String!) {
                    getUsersMaps(username: $username){
                        owner,
                        name,
                        map{
                            val,
                            type,
                            x,
                            y
                        },
                        highest_score,
                        second_highest_score,
                        third_highest_score,
                    }
                },
            `),
}

export default Map;