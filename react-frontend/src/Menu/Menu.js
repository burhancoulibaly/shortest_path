import React, { useContext } from 'react';
import './Menu.css';
import MenuContext from "../MenuContext";
import UserContext from "../UserContext";

const onAlgorithmChange = (algorithm, dispatch) => {
    dispatch({type: 'setAlgorithm', payload: { algorithm: algorithm }})
}

const onHeuristicChange = (heuristic, dispatch) => {
    dispatch({type: 'setHeuristic', payload: { heuristic: heuristic }})
}

function Menu({initialState}){
    const {user} = useContext(UserContext);
    const {menuState, dispatch} = useContext(MenuContext);

    return (
        <div className="sb-menu">
            <div className="sb-menu-container">
                <div className="itemType-btns">
                    <button className={(menuState.itemState === "start" ? "active" : "")} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "start" }})}>Start Item</button>
                    <button className={(menuState.itemState === "wall" ? "active" : "")} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "wall" }})}>Wall Item</button>
                    <button className={(menuState.itemState === "end" ? "active" : "")} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "end" }})}>End Item</button>
                </div>
                <div className="algorithm-settings">
                    <select name="algorithm" id="algorithm" value={menuState.algorithm} onChange={(e) => onAlgorithmChange(e.currentTarget.value, dispatch)}>
                        <option value="astar">A*</option>
                        <option value="dijkstra">Dijkstra</option>
                        <option value="bfs">Breadth First Search</option>
                        <option value="dfs">Depth First Search</option>
                        <option value="greedybfs">Greedy Best First Search</option>
                    </select>
                    <select disabled={menuState.algorithm !== "astar" && menuState.algorithm !== "greedybfs"} name="hueristic" id="heuristic" value={menuState.heuristic} onChange={(e) => onHeuristicChange(e.currentTarget.value, dispatch)}>
                        <option value="manhattan">Manhattan Distance</option>
                        <option value="euclidean">Euclidean Distance</option>
                    </select>
                </div>
                <div className="path-settings">
                    <div>
                        <label htmlFor="cutCorners">Cut Corners</label>
                        <input checked={menuState.cutCorners} id="cutCorners" type="checkbox" onChange={() => dispatch({type: 'cutCorners'})}></input>
                    </div>
                    <div>
                        <label htmlFor="allowDiags">Diagonals</label>
                        <input checked={menuState.allowDiags} id="allowDiags" type="checkbox" onChange={() => dispatch({type: 'allowDiags'})}></input>      
                    </div>
                    <div>
                        <label htmlFor="biDirectional">Bi-Directional</label>
                        <input disabled={menuState.algorithm === "dfs"} checked={menuState.biDirectional} id="biDirectional" type="checkbox" onChange={() => dispatch({type: 'biDirectional'})}></input>
                    </div>
                </div>
                <div className="map-settings">
                    <button onClick={() => dispatch({type: 'pathClear'})}>Clear Path</button>
                    <button onClick={() => dispatch({type: 'clear'})}>Clear</button>
                    <button className={(user.role === "guest" ? "disabled" : "")} disabled={user.role === "guest"} onClick={() => dispatch({type: 'save'})}>Save</button>
                    <button onClick={() => dispatch({type: 'reset', payload: {init: initialState}})}>Reset</button>
                </div>
                <button onClick={() => dispatch({type: 'run'})}>Run</button>
            </div>
        </div>
    )
}

export default Menu;