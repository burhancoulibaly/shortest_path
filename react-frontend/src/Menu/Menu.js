import React, { useContext } from 'react';
import './Menu.css';
import MenuContext from "../MenuContext";

function Menu(){
    const {dispatch} = useContext(MenuContext);

    return (
        <div className="menu">
            <button onClick={() => dispatch({type: 'setItemState', payload: { itemState: "start" }})}>Start Item</button>
            <button onClick={() => dispatch({type: 'setItemState', payload: { itemState: "wall" }})}>Wall Item</button>
            <button onClick={() => dispatch({type: 'setItemState', payload: { itemState: "end" }})}>End Item</button>
            <button onClick={() => dispatch({type: 'setAlgorithm', payload: { algorithm: "astar" }})}>A*</button>
            <button onClick={() => dispatch({type: 'setAlgorithm', payload: { algorithm: "dijkstra" }})}>Dijkstra</button>
            <button onClick={() => dispatch({type: 'setAlgorithm', payload: { algorithm: "bfs" }})}>Breadth First Search</button>
            <button onClick={() => dispatch({type: 'setAlgorithm', payload: { algorithm: "dfs" }})}>Depth First Search</button>
            <button onClick={() => dispatch({type: 'setHeuristic', payload: { heuristic: "manhattan" }})}>Manhattan Distance</button>
            <button onClick={() => dispatch({type: 'setHeuristic', payload: { heuristic: "euclidean" }})}>Euclidean Distance</button>
            <button onClick={() => dispatch({type: 'pathClear'})}>Clear Path</button>
            <button onClick={() => dispatch({type: 'clear'})}>Clear</button>
            <button onClick={() => dispatch({type: 'run'})}>Run</button>
        </div>
    )
}

export default Menu;