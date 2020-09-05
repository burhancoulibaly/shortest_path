import React, { useState, useEffect, useMemo, useReducer } from 'react';
import './Sandbox.css';
import Map from '../Map/Map';
import Menu from '../Menu/Menu';
import MenuContext from '../MenuContext';

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
        isEdit: initialState.isEdit
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
        isEdit: false
    }

    const [menuState, dispatch] = useReducer(reducer, initialState, init)

    const menu = useMemo(() => ({menuState, dispatch}), [menuState, dispatch]);

    if(!menuState.mapName.length > 0){
        if(props.location.state){
            menu.dispatch({type: "edit"});
            menu.dispatch({type: "mapName", payload: { mapName: props.location.state.mapName }});
        }
    }
    console.log(menu.menuState.mapName, menu.menuState.mapName[0], menu.menuState.mapName[menuState.mapName.length-1])

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
            <MenuContext.Provider value={menu}>
                <Map 
                    winDimensions={winDimensions}
                    userMap={props.location.state ? props.location.state.userMap : null}
                />
                <Menu 
                    initialState={initialState}
                />
            </MenuContext.Provider>
        </div>
    );
}

export default Sandbox;