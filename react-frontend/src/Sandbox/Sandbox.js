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
        isDrawn: initialState.isDrawn
    }
}

function reducer(menuState, action){
    switch (action.type) {
        case 'setItemState':
            return {...menuState, itemState: action.payload.itemState}
        case 'setHeuristic':
            return {...menuState, heuristic: action.payload.heuristic}
        case 'clear':
            return {...menuState, clear: true};
        case 'cleared':
            return {...menuState, clear: false};
        case 'run':
            return {...menuState, run: true};
        case 'complete':
            return {...menuState, run: false};
        case 'drawn':
            return {...menuState, isDrawn: !menuState.isDrawn};
        case 'reset':
            return init(action.payload);
        default:
            throw new Error("Not a valid action");
    }
}

function Sandbox() {
    const [winDimensions, setWinDimensions] = useState({ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight });

    const initialState = {
        itemState: "start",
        heuristic: "euclidean",
        clear: false,
        run: false,
        isDrawn: false
    }

    const [menuState, dispatch] = useReducer(reducer, initialState, init)

    const menu = useMemo(() => ({menuState, dispatch}), [menuState, dispatch]);

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
                />
                <Menu />
            </MenuContext.Provider>
        </div>
    );
}

export default Sandbox;