import React, { useState, useContext, useEffect, useMemo } from 'react';
import './Map.css';
import Square from '../Square/Square';
import MenuContext from '../MenuContext';
import AStar from '../Algorithms/AStar'

function Map(props) {
    const {menuState, dispatch} = useContext(MenuContext);
    const [state, setState] = useState({
        rows: 15,
        cols: 50,
        grid: new Array(15*50).fill({val: false, type: null}).map((square, i) => {
            return {
                ...square,
                x: i % 50,
                y: Math.abs((i - (i % 50)) / 50)
            }
        }),//space-time O(1)
        itemState: menuState.itemState
    })

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
    
    //If run menu button is clicked
    useEffect(() => {
        if(menuState.run === true){
            // if(menuState.isDrawn){
            //     clearPath();
            //     dispatch({type: "drawn"});
            // }

            //Visualize path finding algorithm logic
            console.time()
            const [path, heap] = AStar(memState.rows, memState.cols, memState.grid, menuState.heuristic);
            console.timeEnd()

            if(path && heap){
                console.log(path);
                console.log(heap);

                drawPath(path, heap);
            }            

            return dispatch({type: "complete"});
        }
    }, [menuState.run, menuState.heuristic, memState.grid, memState.rows, memState.cols, dispatch]);

    // const clearPath = () => {
    //     setState((memState) => ({
    //         ...memState,
    //         grid: memState.grid.map((square, index) => {
    //             console.log("clearing");
    //             console.log(memState.grid[index-1]);
    //             if(square.type !== "start" && square.type !== "end"){
    //                 memState.grid[index] = {
    //                     ...square,
    //                     val: false,
    //                     type: "path"
    //                 }
    //             }

    //             return {...square}
    //         })
    //     }))
    //     return;
    // }

    const drawPath = (path, heap) => {
        setState((memState) => ({
            ...memState,
            //state object is immutable so updates have to be done this way
            grid: memState.grid.map((square, index) => {
                if(path[index]){
                    heap.map((heapPoint) => {
                        if(heapPoint.point.x + (heapPoint.point.y * memState.cols) === index){
                            square = memState.grid[heapPoint.point.x + (heapPoint.point.y * memState.cols)];
    
                            if(square.type !== "start" && square.type !== "end"  && square.type !== "path" && square.type !== "neighbors"){
                                memState.grid[heapPoint.point.x + (heapPoint.point.y * memState.cols)] = {
                                    ...square,
                                    val: true,
                                    type: "openset"
                                }
    
                                // console.log(memState.grid[heapPoint.point.x + (heapPoint.point.y * memState.cols)])
                            }
    
                            return null;
                        }
    
                        return {...memState.grid[heapPoint.point.x + (heapPoint.point.y * memState.cols)]}
                    })


                    if(square.type !== "start" && square.type !== "end" && square.type !== "path" && square.type !== "openset"){
                        return {...square, val: true, type: "neighbors"};
                    }
                }

                if(square.type === "end"){
                    let cameFrom = path[index];

                    while(cameFrom){
                        square = memState.grid[cameFrom.x + (cameFrom.y * memState.cols)];
                        
                        if(square.type !== "start" && square.type !== "end"){
                            memState.grid[cameFrom.x + (cameFrom.y * memState.cols)] = {
                                ...square,
                                val: true,
                                type: "path"
                            }
                        }

                        cameFrom = path[cameFrom.x + (cameFrom.y * memState.cols)];
                    }
                    
                    return {...memState.grid[index]};
                }

                return {...square};
            })
        }));

        // dispatch({type: "drawn"});
    }
    
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
            {console.time()}
                {renderMap()}
            {console.timeEnd()}
        </div>
    )
}

export default Map;