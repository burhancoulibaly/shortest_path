import React, { useContext, useState, useCallback } from 'react';
import './Menu.css';
import MenuContext from "../MenuContext";
import UserContext from "../UserContext";
import Modal from 'react-bootstrap/Modal';
import InputValidationHelper from '../Helpers/InputValidationHelper';

const onAlgorithmChange = (algorithm, dispatch) => {
    dispatch({type: 'setAlgorithm', payload: { algorithm: algorithm }})
}

const onHeuristicChange = (heuristic, dispatch) => {
    dispatch({type: 'setHeuristic', payload: { heuristic: heuristic }})
}

function SaveMapModal({mapName, handleSave, ...props}){
    const [inputState, setInputState] = useState({
        isMapNameValid: true,
        mapNameErrorMessage: "",
    })

    const validateNameEdit = (mapName) => {
        const isValid = InputValidationHelper.validateString(mapName);
    
        console.log(isValid)
        setInputState({
          ...inputState,
          isMapNameValid: isValid,
          mapNameErrorMessage: isValid === false ? "Invalid map name" : ""
        })

        if(isValid){
            handleSave(mapName);
        }
    }

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
                        <input className={(!inputState.isMapNameValid ? "error" : "") + " form-control"} id="mapname" aria-describedby="mapNameHelp" type="text" defaultValue={ mapName[mapName.length-1] } placeholder="Unamed"/>
                        {!inputState.isMapNameValid &&
                            <div className="error-text">
                            <br></br>
                            {inputState.mapNameErrorMessage}
                            <br></br>
                            </div> 
                        }
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={() => validateNameEdit(document.getElementsByClassName("savemap")[0][0].value)}>Save</button>
            </Modal.Footer>
        </Modal>
    );
}

function EditMapModal({mapName, handleNameEdit, ...props}){
    const [inputState, setInputState] = useState({
        isMapNameValid: true,
        mapNameErrorMessage: null,
    })

    const validateNameEdit = (mapName) => {
        console.log(mapName)
        const isValid = InputValidationHelper.validateString(mapName);

        setInputState({
          ...inputState,
          isMapNameValid: isValid,
          mapNameErrorMessage: isValid === false ? "Invalid map name" : ""
        })

        if(isValid){
            handleNameEdit(mapName);
        }
    }

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
                        <input className={(!inputState.isMapNameValid ? "error" : "") + " form-control"} id="mapname" aria-describedby="mapNameHelp" type="text" defaultValue={ mapName[mapName.length-1] } placeholder="Unamed"/>
                        {!inputState.isMapNameValid &&
                            <div className="error-text">
                            <br></br>
                            {inputState.mapNameErrorMessage}
                            <br></br>
                            </div> 
                        }
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" onClick={() => validateNameEdit(document.getElementsByClassName("editmap")[0][0].value)}>Save Name</button>
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

    const handleClose = useCallback(() => {
        setModalShow(false);
    }, [setModalShow])

    const handleSave = (mapName) => {
        //change isEdit to true, after this is done
        handleClose();
        dispatch({type: "mapName", payload: { mapName: mapName }});
        dispatch({type: "save"});
    }

    return (
        <>
            <button className={(props.user.role === "guest" ? "disabled" : "") + " btn btn-primary"} disabled={props.user.role === "guest"} variant="primary" onClick={() => handleShow()}>
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

    const handleClose = useCallback(() => {
        setModalShow(false);
    }, [setModalShow])

    const handleNameEdit = useCallback((mapName) => {
        handleClose();
        dispatch({type: "mapName", payload: { mapName: mapName }});
    }, [handleClose, dispatch])

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
                    <button className={(menuState.itemState === "start" ? "selected" : "") + " btn btn-primary"} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "start" }})}>Start Item</button>
                    <button className={(menuState.itemState === "wall" ? "selected" : "") + " btn btn-primary"} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "wall" }})}>Wall Item</button>
                    <button className={(menuState.itemState === "end" ? "selected" : "") + " btn btn-primary"} onClick={() => dispatch({type: 'setItemState', payload: { itemState: "end" }})}>End Item</button>
                </div>
                <div className="algorithm-settings form-group">
                    <select className="form-control" name="algorithm" id="algorithm" value={menuState.algorithm} onChange={(e) => onAlgorithmChange(e.currentTarget.value, dispatch)}>
                        <option value="astar">A*</option>
                        <option value="dijkstra">Dijkstra</option>
                        <option value="bfs">Breadth First Search</option>
                        <option value="dfs">Depth First Search</option>
                        <option value="greedybfs">Greedy Best First Search</option>
                    </select>
                    <select className="form-control" disabled={menuState.algorithm !== "astar" && menuState.algorithm !== "greedybfs"} name="hueristic" id="heuristic" value={menuState.heuristic} onChange={(e) => onHeuristicChange(e.currentTarget.value, dispatch)}>
                        <option value="manhattan">Manhattan Distance</option>
                        <option value="euclidean">Euclidean Distance</option>
                    </select>
                </div>
                <div className="path-settings">
                    <div className="form-check">
                        <input className="form-check-input" checked={menuState.cutCorners} id="cutCorners" type="checkbox" onChange={() => dispatch({type: 'cutCorners'})}></input>
                        <label className="form-check-label" htmlFor="cutCorners">Cut Corners</label>
                    </div>
                    <div className="form-check">
                    <input className="form-check-input" checked={menuState.allowDiags} id="allowDiags" type="checkbox" onChange={() => dispatch({type: 'allowDiags'})}></input>      
                        <label className="form-check-label" htmlFor="allowDiags">Diagonals</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" disabled={menuState.algorithm === "dfs"} checked={menuState.biDirectional} id="biDirectional" type="checkbox" onChange={() => dispatch({type: 'biDirectional'})}></input>
                        <label className="form-check-label" htmlFor="biDirectional">Bi-Directional</label>
                    </div>
                </div>
                <div className="map-settings">
                    <button className="btn btn-primary" onClick={() => dispatch({type: 'pathClear'})}>Clear Path</button>
                    <button className="btn btn-primary" onClick={() => dispatch({type: 'clear'})}>Clear</button>
                    <SaveMap 
                        user={user}
                        mapName={menuState.mapName}
                        dispatch={dispatch}
                    />
                    <button className="btn btn-primary" onClick={() => dispatch({type: 'reset', payload: {init: initialState}})}>Reset</button>
                </div>
                <button className="btn btn-primary" onClick={() => dispatch({type: 'run'})}>Run</button>
            </div>
        </div>
    )
}

export default Menu;