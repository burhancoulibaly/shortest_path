import React, { useState, useEffect, useMemo, useReducer } from 'react';
import './Sandbox.css';
import Map from '../Map/Map';
import Menu from '../Menu/Menu';
import MenuContext from '../MenuContext';
import { useLazyQuery } from '@apollo/client';
import MapHelper from '../Helpers/MapHelper';

function init(initialState){
    return {
        itemState: initialState.itemState,
        clear: initialState.clear,
        run: initialState.run,
        heuristic: initialState.heuristic,
        algorithm: initialState.algorithm,
        pathClear: initialState.pathClear,
        cutCorners: initialState.cutCorners,
        allowDiags: initialState.allowDiags,
        biDirectional: initialState.biDirectional,
        isResetting: initialState.isResetting,
        isSaving: initialState.isSaving,
        mapName: initialState.mapName,
        isEdit: initialState.isEdit,
    }
}

function reducer(menuState, action){
    switch (action.type) {
        case 'setItemState':
            return {...menuState, itemState: action.payload.itemState}
        case 'mapName':
            return {...menuState, mapName: [...menuState.mapName, action.payload.mapName]}
        case 'mapNameReset':
            return {...menuState, mapName: []}
        case 'setHeuristic':
            return {...menuState, heuristic: action.payload.heuristic}
        case 'setAlgorithm':
            return {...menuState, algorithm: action.payload.algorithm}   
        case 'clear':
            return {...menuState, clear: true};
        case 'cleared':
            return {...menuState, clear: false};
        case 'pathClear':
            return {...menuState, pathClear: true};
        case 'pathCleared':
            return {...menuState, pathClear: false};
        case 'run':
            return {...menuState, run: true};
        case 'complete':
            return {...menuState, run: false};
        case 'cutCorners':
            return {...menuState, cutCorners: !menuState.cutCorners};
        case 'allowDiags':
            return {...menuState, allowDiags: !menuState.allowDiags};
        case 'biDirectional':
            return {...menuState, biDirectional: !menuState.biDirectional};
        case 'reset':
            return {...menuState, isResetting: !menuState.isResetting};
        case 'save':
            return {...menuState, isSaving: !menuState.isSaving};
        case 'edit':
            return {...menuState, isEdit: true};
        case 'initialize':
            return init(action.payload.init);
        default:
            throw new Error("Not a valid action");
    }
}

function Sandbox(props) {
    const [winDimensions, setWinDimensions] = useState({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });

    const initialState = {
        itemState: "start",
        heuristic: "euclidean",
        algorithm: "astar",
        clear: false,
        pathClear: false,
        run: false,
        cutCorners: false,
        allowDiags: true,
        biDirectional: false,
        isResetting: false,
        isSaving: false,
        mapName: [],
        isEdit: false,
    }

    const [menuState, dispatch] = useReducer(reducer, initialState, init);
    const [fetchedMap, setFetchedMap] = useState(null);

    const menu = useMemo(() => ({menuState, dispatch}), [menuState, dispatch]);

    const [getUserMap, { error: getUserMapError, loading: getUserMapLoading, data: getUserMapData }] = useLazyQuery(MapHelper.getUserMap);
    
    useEffect(() => {
        if(parseInt(localStorage.getItem("mapVersion")) !== 0){
            if(getUserMapError){
                console.log(getUserMapError);
            }
    
            if(getUserMapLoading){
                dispatch({type: "mapNameReset"});
                dispatch({type: "mapName", payload: { mapName: "..." }});
            }
    
            if(getUserMapData){
                // console.log("data retrieved")
                dispatch({type: "edit"});
                dispatch({type: "mapNameReset"});
                dispatch({type: "mapName", payload: { mapName: getUserMapData.getUserMap.name }});
    
                setFetchedMap((fetchedMap) => {
                    return getUserMapData.getUserMap.map;
                })

                localStorage.setItem("mapVersion", 0);
            }
        }  
    }, [getUserMapError, getUserMapLoading, getUserMapData, dispatch]);

    useEffect(() => {
        const handleWinResize = () => {
            setWinDimensions({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            })
        }

        window.addEventListener('resize', handleWinResize);

        // console.log("Window has been resized: ", winDimensions.width, winDimensions.height);

        return () => {
            window.removeEventListener('resize', handleWinResize);
        };
    })

    if(!menu.menuState.mapName.length > 0){
        if(props.history.action === "PUSH"){
            localStorage.removeItem("map");
            localStorage.removeItem("mapVersion");
        }

        if(props.location.state){
            localStorage.setItem("mapVersion", 0);
            localStorage.setItem("map", JSON.stringify(props.location.state));

            menu.dispatch({type: "edit"});
            menu.dispatch({type: "mapName", payload: { mapName: props.location.state.mapName }});

            setFetchedMap((fetchedMap) => {
                return JSON.parse(localStorage.getItem("map")).userMap;
            })
        }else if(localStorage.getItem("map")){
            // console.log(parseInt(localStorage.getItem("mapVersion")));
            // console.log(JSON.parse(localStorage.getItem("map")));

            if(parseInt(localStorage.getItem("mapVersion")) !== 0){
                getUserMap({
                    variables: {
                        mapName: JSON.parse(localStorage.getItem("map")).mapName
                    }
                })
            }else{
                menu.dispatch({type: "edit"});
                menu.dispatch({type: "mapName", payload: { mapName: JSON.parse(localStorage.getItem("map")).mapName }});

                setFetchedMap((fetchedMap) => {
                    return JSON.parse(localStorage.getItem("map")).userMap;
                })
            }
        }
    }

    return (
        <div id="sandbox">
            <MenuContext.Provider value={menu}>
                <Map 
                    winDimensions={winDimensions}
                    userMap={fetchedMap}
                />
                <Menu 
                    initialState={initialState}
                />
            </MenuContext.Provider>
        </div>
    );
}

export default Sandbox;