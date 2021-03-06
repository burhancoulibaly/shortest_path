import Stack from '../Algorithms/Stack'

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
    //Reordered neighbors for better visualization
    if(point.x > 0){
        const left = getIndex((point.x-1), (point.y), cols);

        if(gridMap[left].type !== "wall" && gridMap[left].type !== "start"){
            neighbors[4] = gridMap[left];
        }
    }
    if(point.x < cols-1){
        const right = getIndex((point.x+1), (point.y), cols);

        if(gridMap[right].type !== "wall" && gridMap[right].type !== "start"){
            neighbors[6] = gridMap[right];
        }
    }
    if(point.y > 0){
        const up = getIndex((point.x), (point.y-1), cols);

        if(gridMap[up].type !== "wall" && gridMap[up].type !== "start"){
            neighbors[7] = gridMap[up];
        }
    }
    if(point.y < rows-1){
        const down = getIndex((point.x), (point.y+1), cols);

        if(gridMap[down].type !== "wall" && gridMap[down].type !== "start"){
            neighbors[5] = gridMap[down];
        }
    }
    if(point.x > 0 && point.y > 0){
        const topLeft = getIndex((point.x-1), (point.y-1), cols);

        if(gridMap[topLeft].type !== "wall" && gridMap[topLeft].type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[topLeft+1].type !== "wall" && gridMap[topLeft+50].type !== "wall"){
                        neighbors[0] = gridMap[topLeft];
                    }
                }else{
                    neighbors[0] = gridMap[topLeft];
                }
            }
        }
    }
    if(point.x < cols-1 && point.y > 0){
        const topRight = getIndex((point.x+1), (point.y-1), cols);

        if(gridMap[topRight].type !== "wall" && gridMap[topRight].type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[topRight-1].type !== "wall" && gridMap[topRight+50].type !== "wall"){
                        neighbors[1] = gridMap[topRight];
                    }
                }else{
                    neighbors[1] = gridMap[topRight];
                }
            }
        }
    }
    if(point.x > 0 && point.y < rows-1){
        const bottomLeft  = getIndex((point.x-1), (point.y+1), cols);

        if(gridMap[bottomLeft].type !== "wall" && gridMap[bottomLeft].type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[bottomLeft+1].type !== "wall" && gridMap[bottomLeft-50].type !== "wall"){
                        neighbors[3] = gridMap[bottomLeft];
                    }
                }else{
                    neighbors[3] = gridMap[bottomLeft];
                }
            }
        }
    }
    if(point.x < cols-1 && point.y < rows-1){
        const bottomRight = getIndex((point.x+1), (point.y+1), cols);

        if(gridMap[bottomRight].type !== "wall" && gridMap[bottomRight].type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(gridMap[bottomRight-1].type !== "wall" && gridMap[bottomRight-50].type !== "wall"){
                        neighbors[2] = gridMap[bottomRight];
                    }
                }else{
                    neighbors[2] = gridMap[bottomRight];
                }
            }
        }
    }

    return neighbors;
}

function DFS(rows, cols, gridMap, memState, setState, cutCorners, allowDiags){
    const [startPoint, endPoints] = getPoints(gridMap);
    const stack = new Stack();
    const discovered = {};
    const cameFrom = {};
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
    cameFrom[getIndex(startPoint.x, startPoint.y, cols)] = null

    stack.push(points[getIndex(startPoint.x, startPoint.y, cols)]);

    while(stack.length() > 0){
        // console.log(Array.from(stack.getStack()));
        const current = stack.top();
        // console.log("current",current);

        stack.pop();
        discovered[getIndex(current.x, current.y, cols)] = "discovered";
        
        const newState = {
            ...memState,
            grid: memState.grid.map((square, index) => {
                if(current.x === square.x && current.y === square.y){
                    if(current.type !== "start" && current.type !== "end"){
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
        
        if(current.x === goal.x && current.y === goal.y){
            const state = states[states.length-1];
            setState({
                ...state,
                //state object is immutable so updates have to be done this way
                grid: state.grid.map((square, index) => {
                    if(cameFrom[index]){
                        if(square.type === "end"){
                            let prev = cameFrom[index];
                            
                            while(prev !== null){                  
                                if(prev.type !== "start" && prev.type !== "end"){
                                    state.grid[getIndex(prev.x,prev.y,state.cols)] = {
                                        ...state.grid[getIndex(prev.x,prev.y,state.cols)],
                                        val: true,
                                        type: "path"
                                    }
                                }

                                prev = cameFrom[getIndex(prev.x,prev.y,state.cols)];
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
        }

        const neighbors = getNeighbors(current, gridMap, rows, cols, discovered, cutCorners, allowDiags);

        neighbors.map((neighbor) => {
            if(!discovered[getIndex(neighbor.x, neighbor.y, cols)]){
                points[getIndex(neighbor.x, neighbor.y, cols)] = neighbor;

                cameFrom[getIndex(neighbor.x, neighbor.y, cols)] = current;

                stack.push(points[getIndex(neighbor.x, neighbor.y, cols)]);

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
    
                return null;
            }

            return null
        });
    }
    return states;
}

export default DFS;