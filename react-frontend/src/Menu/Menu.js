import React, { useContext } from 'react';
import './Menu.css';
import MenuContext from "../MenuContext";
import UserContext from "../UserContext";
import Modal from 'react-bootstrap/Modal';

const onAlgorithmChange = (algorithm, dispatch) => {
    dispatch({type: 'setAlgorithm', payload: { algorithm: algorithm }})
}

const onHeuristicChange = (heuristic, dispatch) => {
    dispatch({type: 'setHeuristic', payload: { heuristic: heuristic }})
}

function SaveMapModal({mapName, handleSave, ...props}){
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Set Map Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="savemap">
                    <div className="form-group">
                        <label htmlFor="mapname">Map Name</label>
                        <input type="mapname" className="form-control" id="mapname" aria-describedby="mapNameHelp" type="text" defaultValue={ mapName[mapName.length-1] } placeholder="Unamed"/>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => handleSave(document.getElementsByClassName("savemap")[0][0].value)}>Save</button>
            </Modal.Footer>
        </Modal>
    );
}

function EditMapModal({mapName, handleNameEdit, ...props}){
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Set Map Name
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form className="editmap">
                    <div className="form-group">
                        <label htmlFor="mapname">Map Name</label>
                        <input type="mapname" className="form-control" id="mapname" aria-describedby="mapNameHelp" type="text" defaultValue={ mapName[mapName.length-1] } placeholder="Unamed"/>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => handleNameEdit(document.getElementsByClassName("editmap")[0][0].value)}>Save Name</button>
            </Modal.Footer>
        </Modal>
    );
}

function  SaveMap({mapName, dispatch, ...props}){
    const [modalShow, setModalShow] = React.useState(false);

    const handleShow = () => {
        console.log(mapName)
        if(mapName.length > 0){
            dispatch({type: "save"});
        }else{
            setModalShow(true);
        }
    }

    const handleClose = () => {
        setModalShow(false);
    }

    const handleSave = (mapName) => {
        //change isEdit to true, after this is done
        handleClose();
        dispatch({type: "mapName", payload: { mapName: mapName }});
        dispatch({type: "save"});
        dispatch({type: "edit"});
    }

    return (
        <>
            <button className={(props.user.role === "guest" ? "disabled" : "")} disabled={props.user.role === "guest"} variant="primary" onClick={() => handleShow()}>
                Save
            </button>

            <SaveMapModal
                show={modalShow}
                handleSave={(mapName) => handleSave(mapName)}
                mapName={mapName}
                onHide={() => handleClose()}
            />
        </>
    );
}

function  EditMapName({menuState, dispatch, ...props}){
    const [modalShow, setModalShow] = React.useState(false);

    const handleShow = () => {
        setModalShow(true);
    }

    const handleClose = () => {
        setModalShow(false);
    }

    const handleNameEdit = (mapName) => {
        handleClose();
        dispatch({type: "mapName", payload: { mapName: mapName }});
    }

    return (
        <>
            <h4 className="mapname" onClick={() => handleShow()}>
                {menuState.mapName.length > 0 ? menuState.mapName[menuState.mapName.length-1] : "Unamed"}
            </h4>

            <EditMapModal
                show={modalShow}
                handleNameEdit={(mapName) => handleNameEdit(mapName)}
                mapName={menuState.mapName}
                onHide={() => handleClose()}
            />
        </>
    );
}

function Menu({initialState, ...props}){
    const {user} = useContext(UserContext);
    const {menuState, dispatch} = useContext(MenuContext);

    return (
        <div className="sb-menu">
            <div className="sb-menu-container">
                <div>
                    { user &&
                        <EditMapName 
                            user={user}
                            menuState={menuState}
                            dispatch={dispatch}
                        />
                    }  
                </div>
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
                    <SaveMap 
                        user={user}
                        mapName={menuState.mapName}
                        dispatch={dispatch}
                    />
                    <button onClick={() => dispatch({type: 'reset', payload: {init: initialState}})}>Reset</button>
                </div>
                <button onClick={() => dispatch({type: 'run'})}>Run</button>
            </div>
        </div>
    )
}

export default Menu;