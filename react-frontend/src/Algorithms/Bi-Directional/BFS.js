import Queue from '..//Queue'

function getIndex(x, y, cols){
    return (x + (y * cols));
}

function getPoints(gridMap){
    let startPoint = null;
    let endPoints = [];
    
    gridMap.map((square) => {
        if(square.val && square.type ===  "start"){
            // console.log(square);
            startPoint = square;

            return null;
        }

        if(square.val && square.type === "end"){
            // console.log(square);
            endPoints.push(square);

            return null;
        }

        return null;
    })

    return [startPoint, endPoints];
}


function getNeighbors(point, gridMap, rows, cols, cutCorners, allowDiags){
    //Point                                 Index
    // left point.x-1, point.y              (point.x-1) + (point.y * cols)
    // right point.x+1, point.y             (point.x+1) + (point.y * cols)
    // up point.x, point.y-1                (point.x) + (point.y-1 * cols)
    // down point.x, point.y+1              (point.x) + (point.y+1 * cols)
    // top left point.x-1, point.y-1        (point.x-1) + (point.y-1 * cols)
    // top right point.x+1, point.y-1       (point.x+1) + (point.y-1 * cols)
    // bottom left point.x-1, point.y+1     (point.x-1) + (point.y+1 * cols)
    // bottom right point.x+1, point.y+1    (point.x+1) + (point.y+1 * cols)
    const neighbors = new Array(8);

    if(point.x > 0){
        const left = getIndex((point.x-1), (point.y), cols);

        if(gridMap[left].type !== "wall" && gridMap[left].type !== "start" && gridMap[left].type !== "end"){
            neighbors[0] = gridMap[left];
        }
    }
    if(point.x < cols-1){
        const right = getIndex((point.x+1), (point.y), cols);

        if(gridMap[right].type !== "wall" && gridMap[right].type !== "start" && gridMap[right].type !== "end"){
            neighbors[1] = gridMap[right];
        }
    }
    if(point.y > 0){
        const up = getIndex((point.x), (point.y-1), cols);

        if(gridMap[up].type !== "wall" && gridMap[up].type !== "start" && gridMap[up].type !== "end"){
            neighbors[2] = gridMap[up];
        }
    }
    if(point.y < rows-1){
        const down = getIndex((point.x), (point.y+1), cols);

        if(gridMap[down].type !== "wall" && gridMap[down].type !== "start" && gridMap[down].type !== "end"){
            neighbors[3] = gridMap[down];
        }
    }
    if(point.x > 0 && point.y > 0){
        const topLeft = getIndex((point.x-1), (point.y-1), cols);

        if(gridMap[topLeft].type !== "wall" && gridMap[topLeft].type !== "start" && gridMap[topLeft].type !== "end"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[topLeft+1].type !== "wall" && gridMap[topLeft+50].type !== "wall"){
                        neighbors[4] = gridMap[topLeft];
                    }
                }else{
                    neighbors[4] = gridMap[topLeft];
                }
            }
        }
    }
    if(point.x < cols-1 && point.y > 0){
        const topRight = getIndex((point.x+1), (point.y-1), cols);

        if(gridMap[topRight].type !== "wall" && gridMap[topRight].type !== "start" && gridMap[topRight].type !== "end"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[topRight-1].type !== "wall" && gridMap[topRight+50].type !== "wall"){
                        neighbors[5] = gridMap[topRight];
                    }
                }else{
                    neighbors[5] = gridMap[topRight];
                }
            }
        }
    }
    if(point.x > 0 && point.y < rows-1){
        const bottomLeft  = getIndex((point.x-1), (point.y+1), cols);

        if(gridMap[bottomLeft].type !== "wall" && gridMap[bottomLeft].type !== "start" && gridMap[bottomLeft].type !== "end"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[bottomLeft+1].type !== "wall" && gridMap[bottomLeft-50].type !== "wall"){
                        neighbors[6] = gridMap[bottomLeft];
                    }
                }else{
                    neighbors[6] = gridMap[bottomLeft];
                }
            }
        }
    }
    if(point.x < cols-1 && point.y < rows-1){
        const bottomRight = getIndex((point.x+1), (point.y+1), cols);

        if(gridMap[bottomRight].type !== "wall" && gridMap[bottomRight].type !== "start" && gridMap[bottomRight].type !== "end"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[bottomRight-1].type !== "wall" && gridMap[bottomRight-50].type !== "wall"){
                        neighbors[7] = gridMap[bottomRight];
                    }
                }else{
                    neighbors[7] = gridMap[bottomRight]
                }
            }
        }
    }

    return neighbors;
}

function BFSBiDirectional(rows, cols, gridMap, memState, setState, cutCorners, allowDiags){
    const [startPoint, endPoints] = getPoints(gridMap);
    const queueLeft = new Queue();
    const queueRight = new Queue();
    const discoveredFromLeft = {};
    const discoveredFromRight = {};
    const cameFromLeft = {};
    const cameFromRight = {};
    const points = {};
    const states = [];

    //TODO: Bug, clears grid but then returns it to its previous state
    const newState = {
        ...memState,
        grid: new Array(rows*cols).fill({val: false, type: null}).map((square, i) => {
            return {
                ...square,
                x: i % cols,
                y: Math.abs((i - (i % cols)) / cols)
            }
        })
    }
    states.push(newState);

    const goal = endPoints[0];

    if(!startPoint || endPoints.length === 0){
        console.log("Map must have a start point, and an end point");
        return null; 
    }

    points[getIndex(startPoint.x, startPoint.y, cols)] = startPoint;
    cameFromLeft[getIndex(startPoint.x, startPoint.y, cols)] = null;

    queueLeft.enqueue(points[getIndex(startPoint.x, startPoint.y, cols)]);
    discoveredFromLeft[getIndex(startPoint.x, startPoint.y, cols)] = "discovered";


    points[getIndex(goal.x, goal.y, cols)] = goal;
    cameFromRight[getIndex(goal.x, goal.y, cols)] = null;

    queueRight.enqueue(points[getIndex(goal.x, goal.y, cols)]);
    discoveredFromRight[getIndex(goal.x, goal.y, cols)] = "discovered";

    while(queueLeft.length() > 0 && queueRight.length() > 0){
        // console.log(Array.from(queue.getQueue()))
        const current1 = queueLeft.peek();
        const current2 = queueRight.peek();
        // console.log("current",current);

        queueLeft.dequeue();
        queueRight.dequeue();

        const newState = {
            ...memState,
            grid: memState.grid.map((square, index) => {
                if(current1.x === square.x && current1.y === square.y){
                    if(current1.type !== "start" && current1.type !== "end"){
                        memState.grid[index] = {
                            ...memState.grid[index],
                            val: true,
                            type: "neighbors"
                        }
                    }
                    return {...square}
                }
                if(current2.x === square.x && current2.y === square.y){
                    if(current2.type !== "start" && current2.type !== "end"){
                        memState.grid[index] = {
                            ...memState.grid[index],
                            val: true,
                            type: "neighbors"
                        }
                    }
                    return {...square}
                }
                return {...square}
            })
        }
        states.push(newState);

        if(cameFromLeft[getIndex(current2.x, current2.y, cols)] || cameFromRight[getIndex(current1.x, current1.y, cols)]){
            let cameFromLeftPoint;
            let cameFromRightPoint;

            if(cameFromLeft[getIndex(current2.x, current2.y, cols)]){
                cameFromRightPoint = current2;
                cameFromLeftPoint = current2;
            }else if(cameFromRight[getIndex(current1.x, current1.y, cols)]){
                cameFromRightPoint = current1;
                cameFromLeftPoint = current1;
            }
            

            const state = states[states.length-1];
            setState({
                // return {
                ...state,
                //state object is immutable so updates have to be done this way
                grid: state.grid.map((square, index) => {
                    if(cameFromLeft[index] || cameFromRight[index]){
                        if(square.x === cameFromLeftPoint.x && square.y === cameFromLeftPoint.y){
                            let prev = cameFromLeftPoint;
                
                            while(prev){                   
                                if(prev.type !== "start"){
                                    state.grid[getIndex(prev.x,prev.y,state.cols)] = {
                                        ...state.grid[getIndex(prev.x,prev.y,state.cols)],
                                        val: true,
                                        type: "path"
                                    }
                                }
                                prev = cameFromLeft[getIndex(prev.x,prev.y,state.cols)];
                            }
                        }
                        if(square.x === cameFromRightPoint.x && square.y === cameFromRightPoint.y){
                            let prev = cameFromRightPoint;
                
                            while(prev){                   
                                if(prev.type !== "end"){
                                    state.grid[getIndex(prev.x,prev.y,state.cols)] = {
                                        ...state.grid[getIndex(prev.x,prev.y,state.cols)],
                                        val: true,
                                        type: "path"
                                    }
                                }
                                prev = cameFromRight[getIndex(prev.x,prev.y,state.cols)];
                            }
                            return {...square};
                        }
                        return {...square};
                    }
                    return {...square};
                })
                
            });

            console.log("PATH FOUND!!!!!");
            return states;
        };

        const neighbors1 = getNeighbors(current1, gridMap, rows, cols, cutCorners, allowDiags);
        const neighbors2 = getNeighbors(current2, gridMap, rows, cols, cutCorners, allowDiags);

        neighbors1.map((neighbor) => {
            if(!discoveredFromLeft[getIndex(neighbor.x, neighbor.y, cols)]){
                points[getIndex(neighbor.x, neighbor.y, cols)] = neighbor;

                cameFromLeft[getIndex(neighbor.x, neighbor.y, cols)] = current1;

                queueLeft.enqueue(points[getIndex(neighbor.x, neighbor.y, cols)]);
                discoveredFromLeft[getIndex(neighbor.x, neighbor.y, cols)] = "discovered";

                const newState = {
                    ...memState,
                    grid: memState.grid.map((square, index) => {
                        if(neighbor.x === square.x && neighbor.y === square.y){
                            if(neighbor.type !== "start" && neighbor.type !== "end"){
                                memState.grid[index] = {
                                    ...memState.grid[index],
                                    val: true,
                                    type: "openset"
                                }
                            }
                            return {...square}
                        }
                        return {...square}
                    })
                }
                states.push(newState); 
            }

            return null;
        });

        neighbors2.map((neighbor) => {
            if(!discoveredFromRight[getIndex(neighbor.x, neighbor.y, cols)]){
                points[getIndex(neighbor.x, neighbor.y, cols)] = neighbor;

                cameFromRight[getIndex(neighbor.x, neighbor.y, cols)] = current2;

                queueRight.enqueue(points[getIndex(neighbor.x, neighbor.y, cols)]);
                discoveredFromRight[getIndex(neighbor.x, neighbor.y, cols)] = "discovered";

                const newState = {
                    ...memState,
                    grid: memState.grid.map((square, index) => {
                        if(neighbor.x === square.x && neighbor.y === square.y){
                            if(neighbor.type !== "start" && neighbor.type !== "end"){
                                memState.grid[index] = {
                                    ...memState.grid[index],
                                    val: true,
                                    type: "openset"
                                }
                            }
                            return {...square}
                        }
                        return {...square}
                    })
                }
                states.push(newState); 
            }

            return null;
        });
    }

    return states;
}

export default BFSBiDirectional;