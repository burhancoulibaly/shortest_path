import React, { useState, useEffect } from 'react';
import './Square.css';

let downFlag = false;

function Square(props) {
    const [state, setState] = useState({x: props.x, y: props.y, val: props.val, type: props.type});

    useEffect(() => {
        setState((state) => {
            return {
                ...state,
                val: props.val,
                type: props.type
            }
        })
    }, [props.val, props.type]);

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
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `#28fc86` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "wall":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `#c8c6c4` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "end":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `#ef5350` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "path":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `orange` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "neighbors":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `lightblue` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )

        case "openset":
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: props.val === true ? `blue` : `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )
    
        default:
            return (
                <div style={{width: `${props.width}px`, height:`${props.height}px`, backgroundColor: `white`}} className="square" onMouseDown={(e) => handler(e,state.x,state.y)} onMouseUp={(e) => handler(e)} onMouseOver={(e) => handler(e,state.x,state.y)}></div>
            )
    }
}

export default Square;