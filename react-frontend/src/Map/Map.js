import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
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

    const { state: memState } = useMemo(() => ({state}), [state])

    //If item button is changed
    useEffect(() => {
        setState((memState) => {
            return {
                ...memState,
                itemState: menuState.itemState
            }
        })
    }, [menuState.itemState]);

    useEffect(() => {
        if(menuState.isResetting === true){
            if(memState.userMap){
                setState((memState) => ({
                    ...memState,
                    grid: memState.grid.map((square, index) => {
                        if(square !== memState.userMap[index]){
                            return {...memState.userMap[index]}
                        }
                
                        return {...square}
                    }) 
                }))
                return dispatch({type: "reset"});
            }

            setState((memState) => ({
                ...memState,
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
    }, [menuState.isResetting, memState.userMap, dispatch]);

    //If menu clear button is clicked
    useEffect(() => {
        if(menuState.clear === true){
            setState((memState) => ({
                ...memState,
                grid: memState.grid.map((square, index) => {
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
            setState((memState) => ({
                ...memState,
                grid: memState.grid.map((square, index) => {
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
            //saving map
            const map = Array.from(memState.grid);

            map.forEach((square, index) => {
                if(square.type === "path" || square.type === "openset" || square.type === "neighbors"){
                    map[index] = {...map[index], val: false, type: null};
                }

                return {...map[index]};
            })
            
            console.log(map);

            saveMap({
                variables: {
                    username: user.username,
                    map: map
                }
            })
        }
        
    }, [menuState.isSaving, memState.grid, user.username, saveMap, dispatch])

    useEffect(() => {
        if(menuState.isSaving){
            
            if(saveMapError){
                console.log(saveMapError);
                return dispatch({type: "save"});
            }
            
            if(saveMapData){
                console.log(saveMapData);
                return dispatch({type: "save"});
            }
        }
        
    }, [menuState.isSaving, saveMapError, saveMapData, dispatch])
    
    const drawPath = useCallback((newState) => {
        setTimeout(() => {
            if(menuState.run){
                setState({
                    ...newState,
                    //newState object is immutable so updates have to be done this way
                    grid: newState.grid
                }); 
            }
        }, 4)
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
                        states = AStarBiDirectional(memState.rows, memState.cols, memState.grid, menuState.heuristic, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dijkstra":
                        states = DijkstraBiDirectional(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "bfs":
                        states = BFSBiDirectional(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dfs":
                        states = DFS(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "greedybfs":
                        states = GreedyBFSBiDirectional(memState.rows, memState.cols, memState.grid, menuState.heuristic, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    default:
                        console.log("Must choose a path finding algorithm")
                        break;
                }
            }else{
                switch (menuState.algorithm) {
                    case "astar":
                        states = AStar(memState.rows, memState.cols, memState.grid, menuState.heuristic, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dijkstra":
                        states = Dijkstra(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "bfs":
                        states = BFS(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "dfs":
                        states = DFS(memState.rows, memState.cols, memState.grid, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    case "greedybfs":
                        states = GreedyBFS(memState.rows, memState.cols, memState.grid, menuState.heuristic, memState, setState, menuState.cutCorners, menuState.allowDiags);
    
                        break;
                    default:
                        console.log("Must choose a path finding algorithm")
                        break;
                }
            }
            
            // console.timeEnd()
            
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
    }, [menuState.run, menuState.heuristic, menuState.cutCorners, menuState.allowDiags, menuState.algorithm, menuState.biDirectional, memState.grid, memState.rows, memState.cols, memState, drawPath, dispatch]);

    
    const renderSquare = (x,y,val) => {
        return (
            <Square
                //Minus 4 accounts for width and height
                width={
                    memState.cols > memState.rows
                        ? (props.winDimensions.width / memState.cols) - 4
                        : (props.winDimensions.width / memState.cols) * (Math.min((props.winDimensions.width / memState.cols),(props.winDimensions.height / memState.rows)) / Math.max((props.winDimensions.width / memState.cols),(props.winDimensions.height / memState.rows))) - 4 
                }
                height={
                    memState.rows === memState.cols
                        ? (props.winDimensions.height / memState.rows) - 4
                        //converting aspect ration of the square to 1:1 by multiplying the height by minimum of the width and height divided by the maximum of the width and height
                        : (props.winDimensions.height / memState.rows) * (Math.min((props.winDimensions.width / memState.cols),(props.winDimensions.height / memState.rows)) / Math.max((props.winDimensions.width / memState.cols),(props.winDimensions.height / memState.rows))) - 4
                }
                x={x}
                y={y}
                val={val}
                squareClick={(x, y) => handleClick(x, y)}
                type={memState.grid[x + (y * memState.cols)].type}
            />
        )
    }

    const renderMap = () => {
        //TODO: use x y variables set per index for this instead
        //space-time O(1)
        const rows = Array(memState.rows);
        //each row will contain an array of 50 available indexes
        const cols = Array(memState.rows);

        //time O(n)
        for(let i = 0; i < memState.grid.length; i++){
            if(i % memState.cols === 0){
                cols[i / memState.cols] = Array(memState.cols)//space-time O(1)

                rows[i] = (
                    <div className="grid-row" key={i / memState.cols}>
                        {cols[i / memState.cols]}
                    </div>
                )
            }

            let square = (
                <div className="grid-col" key={i}>
                    {renderSquare(i % memState.cols, Math.abs((i - (i % memState.cols)) / memState.cols), memState.grid[i].val)}
                </div>
            )

            cols[(i - (i % memState.cols)) / memState.cols][i % memState.cols] = square;
        }

        const map = rows;

        return map;
    }

    const handleClick = (x,y) => {
        switch (memState.itemState) {
            case "start":
                setState((memState) => ({
                    ...memState,
                    //state object is immutable so updates have to be done this way
                    grid: memState.grid.map((square, index) => {
                        if(index === x + (y * memState.cols)){
                            // console.log(x,y,square.type,memState.itemState);
                            if(square.type === memState.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: memState.itemState}
                            }
                        }

                        if(square.type === memState.itemState && square.val && !memState.grid[x + (y * memState.cols)].val){
                            return {...square, val: false, type: null}
                        }

                        return {...square}
                    })
                }));
                
                break;

            case "wall":
                setState((memState) => ({
                    ...memState,
                    //state object is immutable so updates have to be done this way
                    grid: memState.grid.map((square, index) => {
                        if(index === x + (y * memState.cols)){
                            // console.log(x,y,square.type,state.itemState);
                            if(square.type === memState.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: memState.itemState}
                            }
                        }

                        return {...square}
                    })
                }));

                break;

            case "end":
                setState((memState) => ({
                    ...memState,
                    //state object is immutable so updates have to be done this way
                    grid: memState.grid.map((square, index) => {
                        if(index === x + (y * memState.cols)){
                            // console.log(x,y,square.type,state.itemState);
                            if(square.type === memState.itemState || !square.val){
                                return square.val
                                    ? {...square, val: false, type: null}
                                    : {...square, val: true, type: memState.itemState}
                            }
                        }

                        if(square.type === memState.itemState && square.val && !memState.grid[x + (y * memState.cols)].val){
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