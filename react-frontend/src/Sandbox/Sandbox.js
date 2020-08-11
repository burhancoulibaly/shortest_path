import React, { useState, useEffect } from 'react';
import './Sandbox.css';


let downFlag = false;

//TODO: Runs a little slow, find a way to optimize (possibly using hooks)
function Square(props) {
    const [state, setState] = useState({x: props.x, y: props.y, val: props.val, type: props.itemType});
    
    // console.log(props.width, props.height)

    useEffect(() => {
        setState({
            ...state,
            val: props.val,
            type: props.itemType
        })
    }, [props.val]);

    const handler = (e, x=null, y=null) => {
        if(e.type === "mousedown"){
            downFlag = true;
            // console.log(x,y);
            props.squareClick(x,y);
        }
        
        if(e.type === "mouseover"){
            if(downFlag){
                // console.log(x,y);
                props.squareClick(x, y);
            }
        }

        if(e.type === "mouseup"){
            if(downFlag){
                downFlag = false;
            }
        }
    }

    switch (state.type) {
        case "start":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `green` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "wall":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `gray` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "end":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `red` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )
    
        default:
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )
    }
}

function Map(props) {
    const [state, setState] = useState({
        rows: 15,
        cols: 50,
        grid: new Array(15*50).fill({val: false, type: null}),
        itemType: "start"
    })
    
    const renderSquare = (x,y,val) => {
        return (
            <Square 
                width={
                    state.cols > state.rows
                        ? (props.winDimensions.width / state.cols)
                        : (props.winDimensions.width / state.cols) * (Math.min((props.winDimensions.width / state.cols),(props.winDimensions.height / state.rows)) / Math.max((props.winDimensions.width / state.cols),(props.winDimensions.height / state.rows)))
                }
                height={
                    state.rows === state.cols
                        ? (props.winDimensions.height / state.rows)
                        //converting aspect ration of the square to 1:1 by multiplying the height by minimum of the width and height divided by the maximum of the width and height
                        : (props.winDimensions.height / state.rows) * (Math.min((props.winDimensions.width / state.cols),(props.winDimensions.height / state.rows)) / Math.max((props.winDimensions.width / state.cols),(props.winDimensions.height / state.rows)))
                }
                x={x}
                y={y}
                val={val}
                squareClick={(x, y) => handleClick(x, y)}
                itemType={state.itemType}
            />
        )
    }

    const renderMap = () => {
        const rows = [];
        const cols = {};

        for(let i = 0; i < state.grid.length; i++){
            if(i % state.cols === 0){
                cols[(i - (i % state.cols)) / state.cols] = [];

                rows
                .push(
                    <div className="grid-row" key={(i - (i % state.cols)) / state.cols}>
                        {cols[(i - (i % state.cols)) / state.cols]}
                    </div>
                )
            }

            let square = (
                <div className="grid-col" key={i}>
                    {renderSquare(i % state.cols, (i - (i % state.cols)) / state.cols, state.grid[i].val)}
                </div>
            )

            cols[(i - (i % state.cols)) / state.cols].push(square);
        }

        const map = rows;

        return map;
    }
    

    const switchItemType = (itemType) => {
        setState({
            ...state,
            itemType: itemType,
        })
    }

    const clearMap = () => {
        setState({
            ...state,
            grid: new Array(30*100).fill({val: false, type: null}),
        })
    }

    const handleClick = (x,y) => {
        switch (state.itemType) {
            case "start":
                setState(state => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemType);
                            if(square.type === state.itemType || !square.val){
                                return square.val
                                        ? {...square, val: false, type: null}
                                        : {...square, val: true, type: state.itemType}
                            }
                        }

                        if(square.type === state.itemType && square.val && !state.grid[x + (y * state.cols)].val){
                            return {...square, val: false}
                        }

                        return {...square}
                    })
                }));
                
                break;

            case "wall":
                setState(state => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemType);
                            if(square.type === state.itemType || !square.val){
                                return square.val
                                        ? {...square, val: false, type: null}
                                        : {...square, val: true, type: state.itemType}
                            }
                        }

                        return {...square}
                    })
                }));

                break;

            case "end":
                setState(state => ({
                    ...state,
                    //state object is immutable so updates have to be done this way
                    grid: state.grid.map((square, index) => {
                        if(index === x + (y * state.cols)){
                            // console.log(x,y,square.type,state.itemType);
                            if(square.type === state.itemType || !square.val){
                                return square.val
                                        ? {...square, val: false, type: null}
                                        : {...square, val: true, type: state.itemType}
                            }
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
        <div className="map">
            {console.time()}
                {renderMap()}
            {console.timeEnd()}
            <div className="map-menu">
            <button onClick={() => switchItemType("start")}>Start Item</button>
            <button onClick={() => switchItemType("wall")}>Wall Item</button>
            <button onClick={() => switchItemType("end")}>End Item</button>
            <button onClick={() => clearMap()}>Clear</button>
            <button>Run</button>
            </div>
        </div>
    )
}

function Sandbox() {
    const [winDimensions, setWinDimensions] = useState({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });

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

    return (
        <div id="sandbox">
            <Map 
                winDimensions={winDimensions}
            />
        </div>
    );
}

export default Sandbox;