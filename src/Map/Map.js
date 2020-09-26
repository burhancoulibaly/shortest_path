import React, { useState, useContext, useEffect, useCallback } from 'react';
import UserContext from "../UserContext";
import { useMutation } from '@apollo/client';
import MapHelper from '../Helpers/MapHelper';
import './Map.css';

import Square from '../Square/Square';
import MenuContext from '../MenuContext';
import AStar from '../Algorithms/AStar';
import AStarBiDirectional from '../Algorithms/Bi-Directional/AStar';
import Dijkstra from '../Algorithms/Dijkstra';
import DijkstraBiDirectional from '../Algorithms/Bi-Directional/Dijkstra';
import BFS from '../Algorithms/BFS';
import BFSBiDirectional from '../Algorithms/Bi-Directional/BFS';
import DFS from '../Algorithms/DFS';
import GreedyBFS from '../Algorithms/GreedyBFS';
import GreedyBFSBiDirectional from '../Algorithms/Bi-Directional/GreedyBFS';


function Map(props) {
    const {user} = useContext(UserContext);
    const {menuState, dispatch} = useContext(MenuContext);
    const [state, setState] = useState({
        rows: 15,
        cols: 50,
        grid: props.userMap ? Array.from(props.userMap) : new Array(15*50).fill({val: false, type: null}).map((square, i) => {
            return {
                ...square,
                x: i % 50,
                y: Math.abs((i - (i % 50)) / 50)
            }
        }),//space-time O(1)
        itemState: menuState.itemState,
        userMap: props.userMap ? Array.from(props.userMap) : null
    })
    const [saveMap, { error: saveMapError, data: saveMapData }] = useMutation(MapHelper.saveMap);
    const [editMap, { error: editMapError, data: editMapData }] = useMutation(MapHelper.editMap);
    // const { state: state } = useMemo(() => ({state}), [state])

    // console.log(state.userMap)

    useEffect(() => {
        if(state.userMap === null){
            setState((state) => {
                return {
                    ...state,
                    userMap: props.userMap ? Array.from(props.userMap) : state.userMap,
                }
            })
        }
    }, [props.userMap, state.userMap])

    useEffect(() => {
        setState((state) => {
            return {
                ...state,
                grid: state.userMap ? Array.from(state.userMap) : new Array(15*50).fill({val: false, type: null}).map((square, i) => {
                    return {
                        ...square,
                        x: i % 50,
                        y: Math.abs((i - (i % 50)) / 50)
                    }
                }),
            }
        })
    }, [state.userMap])

    //If item button is changed
    useEffect(() => {
        setState((state) => {
            return {
                ...state,
                itemState: menuState.itemState
            }
        })
    }, [menuState.itemState]);

    useEffect(() => {
        if(menuState.isResetting === true){
            if(state.userMap){
                setState((state) => ({
                    ...state,
                    grid: state.grid.map((square, index) => {
                        if(square !== state.userMap[index]){
                            return {...state.userMap[index]}
                        }
                
                        return {...square}
                    }) 
                }))
                return dispatch({type: "reset"});
            }

            setState((state) => ({
                ...state,
                grid: new Array(15*50).fill({val: false, type: null}).map((square, i) => {
                    return {
                        ...square,
                        x: i % 50,
                        y: Math.abs((i - (i % 50)) / 50)
                    }
                })
            }))
            return dispatch({type: "reset"});
        }
    }, [menuState.isResetting, state.userMap, dispatch]);

    //If menu clear button is clicked
    useEffect(() => {
        if(menuState.clear === true){
            setState((state) => ({
                ...state,
                grid: state.grid.map((square, index) => {
                    if(square.type !== "start" && square.type !== "end"){
                        return {...square, val: false, type: null}
                    }
            
                    return {...square}
                })
            }))
            return dispatch({type: "cleared"});
        }
    }, [menuState.clear, dispatch]);

    //If menu clear path button is clicked
    useEffect(() => {
        if(menuState.pathClear === true){
            setState((state) => ({
                ...state,
                grid: state.grid.map((square, index) => {
                    if(square.type !== "start" && square.type !== "end" && square.type !== "wall"){
                        return {...square, val: false, type: null}
                    }
            
                    return {...square}
                })
            }))
            return dispatch({type: "pathCleared"});
        }
    }, [menuState.pathClear, dispatch]);

    useEffect(() => {
        if(menuState.isSaving){
            if(menuState.isEdit){
                const map = Array.from(state.grid);

                map.forEach((square, index) => {
                    if(square.type === "path" || square.type === "openset" || square.type === "neighbors"){
                        map[index] = {...map[index], val: false, type: null};
                    }

                    return {...map[index]};
                })
                
                // console.log(map);
                // console.log(menuState.mapName);
                // console.log(user.username, menuState.mapName[0], menuState.mapName[menuState.mapName.length-1], map);
                editMap({
                    variables: {
                        username: user.username,
                        mapNameOrig: menuState.mapName[0],
                        mapNameEdit: menuState.mapName[menuState.mapName.length-1],
                        map: map
                    }
                })
            }else{
                //saving map
                const map = Array.from(state.grid);

                map.forEach((square, index) => {
                    if(square.type === "path" || square.type === "openset" || square.type === "neighbors"){
                        map[index] = {...map[index], val: false, type: null};
                    }

                    return {...map[index]};
                })
                
                // console.log(map);
                // console.log(menuState.mapName);
                saveMap({
                    variables: {
                        username: user.username,
                        mapName: menuState.mapName[menuState.mapName.length-1],
                        map: map
                    }
                })
            }
        }
    }, [menuState.isSaving, menuState.mapName, menuState.isEdit, state.grid, user.username, saveMap, editMap, dispatch])

    useEffect(() => {
        if(menuState.isEdit){
            if(menuState.isSaving){
                
                if(editMapError){
                    console.log(editMapError);
                    return dispatch({type: "save"});
                }
                
                if(editMapData){
                    console.log(editMapData);
                    const currentMapName = menuState.mapName[menuState.mapName.length-1];
                    const map = Array.from(state.grid);

                    map.forEach((square, index) => {
                        if(square.type === "path" || square.type === "openset" || square.type === "neighbors"){
                            map[index] = {...map[index], val: false, type: null};
                        }

                        return {...map[index]};
                    })

                    dispatch({type: "save"});
                    dispatch({type: "mapNameReset"});
                    dispatch({type: "mapName", payload: { mapName: currentMapName }});
                    localStorage.setItem("mapVersion", parseInt(localStorage.getItem("mapVersion")) + 1);
                    console.log(parseInt(localStorage.getItem("mapVersion")));

                    setState((state) => ({
                        ...state,
                        userMap: map
                    }));

                    return;
                }
            }
        }
        
    }, [menuState.isSaving, menuState.mapName, menuState.isEdit, state.grid, editMapError, editMapData, dispatch])

    useEffect(() => {
        if(!menuState.isEdit){
            if(menuState.isSaving){
                
                if(saveMapError){
                    console.log(saveMapError);
                    return dispatch({type: "save"});
                }
                
                if(saveMapData){
                    console.log(saveMapData);
                    const currentMapName = menuState.mapName[menuState.mapName.length-1];
                    const map = Array.from(state.grid);

                    map.forEach((square, index) => {
                        if(square.type === "path" || square.type === "openset" || square.type === "neighbors"){
                            map[index] = {...map[index], val: false, type: null};
                        }

                        return {...map[index]};
                    })

                    dispatch({type: "save"});
                    dispatch({type: "mapNameReset"});
                    dispatch({type: "mapName", payload: { mapName: currentMapName }});

                    localStorage.setItem("mapVersion", 0);
                    localStorage.setItem("map", JSON.stringify({
                        mapName: currentMapName,
                        userMap: map
                    }));

                    dispatch({type: "edit"});

                    setState((state) => ({
                        ...state,
                        userMap: map
                    })); 

                    return;
                }
            }
        }
    }, [menuState.isSaving, menuState.mapName, menuState.isEdit, state.grid, saveMapError, saveMapData, dispatch])
    
    const drawPath = useCallback((newState) => {
        setTimeout(() => {
            if(menuState.run){
                setState({
                    ...newState,
                    //newState object is immutable so updates have to be done this way
                    grid: newState.grid
                }); 
            }
        }, 50)
    },[menuState.run])

    //If run menu button is clicked
    useEffect(() => {
        if(menuState.run === true){
            let states = null;

            // Visualize path finding algorithm logic
            // console.time()
            if(menuState.biDirectional === true){
                switch (menuState.algorithm) {
                    case "astar":
                        states = AStarBiDirectional(state.rows, state.cols, state.grid, menuState.heuristic, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dijkstra":
                        states = DijkstraBiDirectional(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "bfs":
                        states = BFSBiDirectional(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dfs":
                        states = DFS(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "greedybfs":
                        states = GreedyBFSBiDirectional(state.rows, state.cols, state.grid, menuState.heuristic, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    default:
                        console.log("Must choose a path finding algorithm")
                        break;
                }
            }else{
                switch (menuState.algorithm) {
                    case "astar":
                        states = AStar(state.rows, state.cols, state.grid, menuState.heuristic, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dijkstra":
                        states = Dijkstra(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "bfs":
                        states = BFS(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dfs":
                        states = DFS(state.rows, state.cols, state.grid, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "greedybfs":
                        states = GreedyBFS(state.rows, state.cols, state.grid, menuState.heuristic, state, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    default:
                        console.log("Must choose a path finding algorithm")
                        break;
                }
            }
            
            // console.timeEnd()

            if(states === null){
                return dispatch({type: "complete"});
            }
            
            states
            .filter((newState, index) => {
                if(index % 20 === 0){
                    return newState;
                }

                if(index === states.length-1){
                    return newState;
                }

                return null;
                
            })
            .map((newState) => {
                drawPath(newState);

                return null
            })

            return dispatch({type: "complete"});
        }
    }, [menuState.run, menuState.heuristic, menuState.cutCorners, menuState.allowDiags, menuState.algorithm, menuState.biDirectional, state.grid, state.rows, state.cols, state, drawPath, dispatch]);

    
    const renderSquare = (x,y,val,userMap) => {
        const rows = state.rows;
        const cols = state.cols; 

        return (
            <Square
                //Minus 4 accounts for width and height
                width={
                    Math.floor(props.winDimensions.width / cols) < Math.floor(props.winDimensions.height / rows)
                        ? Math.floor((props.winDimensions.width) / cols)-4
                        : (Math.floor(props.winDimensions.width / cols)-4) * (Math.floor(props.winDimensions.height / rows)-4) / (Math.floor(props.winDimensions.width / cols)-4)
                }
                height={
                    Math.floor(props.winDimensions.height / rows) < Math.floor(props.winDimensions.width / cols)
                        ? Math.floor(props.winDimensions.height / rows)-4
                        //converting aspect ration of the square to 1:1 by multiplying the height by minimum of the width and height divided by the maximum of the width and height
                        : (Math.floor(props.winDimensions.height / rows)-4) * (Math.floor(props.winDimensions.width / cols)-4) / (Math.floor(props.winDimensions.height / rows)-4)
                }
                x={x}
                y={y}
                val={val}
                squareClick={(x, y) => handleClick(x, y)}
                type={userMap[x + (y * cols)].type}
            />
        )
    }

    const renderMap = (userMap) => {
        //TODO: use x y variables set per index for this instead
        //space-time O(1)
        const rows = Array(state.rows);
        //each row will contain an array of 50 available indexes
        const cols = Array(state.cols);

        const currentMap = !userMap ? state.grid : userMap;

        // if(userMap){
            // console.log(currentMap);
            // console.log(state.grid);
        // }

        //time O(n)
        for(let i = 0; i < currentMap.length; i++){
            if(i % cols.length === 0){
                cols[i / cols.length] = Array(cols.length)//space-time O(1)

                rows[i] = (
                    <div className="grid-row" key={i / cols.length}>
                        {cols[i / cols.length]}
                    </div>
                )
            }

            let square = (
                <div className="grid-col" key={i}>
                    {renderSquare(i % cols.length, Math.abs((i - (i % cols.length)) / cols.length), currentMap[i].val, currentMap)}
                </div>
            )

            cols[(i - (i % cols.length)) / cols.length][i % cols.length] = square;
        }

        const map = rows;

        return map;
    }

    const handleClick = (x,y) => {
        switch (state.itemState) {
            case "start":
                setState((state) => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemState);
                            if(square.type === state.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: state.itemState}
                            }
                        }

                        if(square.type === state.itemState && square.val && !state.grid[x + (y * state.cols)].val){
                            return {...square, val: false, type: null}
                        }

                        return {...square}
                    })
                }));
                
                break;

            case "wall":
                setState((state) => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemState);
                            if(square.type === state.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: state.itemState}
                            }
                        }

                        return {...square}
                    })
                }));

                break;

            case "end":
                setState((state) => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemState);
                            if(square.type === state.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: state.itemState}
                            }
                        }

                        if(square.type === state.itemState && square.val && !state.grid[x + (y * state.cols)].val){
                            return {...square, val: false, type: null}
                        }

                        return {...square}
                    })
                }));

                break;
        
            default:
                break;
        }

        return;
    }
    


    return (
        <div id="map">
            {/* {console.time()} */}
                {renderMap()}
            {/* {console.timeEnd()} */}
        </div>
    )
}

export default Map;