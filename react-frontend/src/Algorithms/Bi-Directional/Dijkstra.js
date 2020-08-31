import FibonacciHeapNode from '../FibonacciHeapNode';
import FibonacciHeap from '../FibonacciHeap';

function getIndex(x, y, cols){
    return (x + (y * cols));
}

function dist(startPoint, endPoint){
    //TODO make this a switch for the different types of heuristic functions
    const distance = Math.sqrt(Math.pow((endPoint.getPoint().x-startPoint.getPoint().x), 2) + Math.pow((endPoint.getPoint().y-startPoint.getPoint().y), 2));     
    return distance;
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

function getNeighbors(current, rows, cols, node, cutCorners, allowDiags){
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
    
    if(current.getPoint().x > 0){
        const left = getIndex((current.getPoint().x-1), (current.getPoint().y), cols);

        if(node[left].node.getPoint().type !== "wall"){
            neighbors[0] = node[left].node;   
        }
    }
    if(current.getPoint().x < cols-1){
        const right = getIndex((current.getPoint().x+1), (current.getPoint().y), cols);

        if(node[right].node.getPoint().type !== "wall"){
            neighbors[1] = node[right].node;   
        }
    }
    if(current.getPoint().y > 0){
        const up = getIndex((current.getPoint().x), (current.getPoint().y-1), cols);

        if(node[up].node.getPoint().type !== "wall"){
            neighbors[2] = node[up].node;   
        }
    }
    if(current.getPoint().y < rows-1){
        const down = getIndex((current.getPoint().x), (current.getPoint().y+1), cols);

        if(node[down].node.getPoint().type !== "wall"){
            neighbors[3] = node[down].node;   
        }
    }
    if(current.getPoint().x > 0 && current.getPoint().y > 0){
        const topLeft = getIndex((current.getPoint().x-1), (current.getPoint().y-1), cols);

        if(node[topLeft].node.getPoint().type !== "wall" && node[topLeft].node.getPoint().type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(node[topLeft+1].node.getPoint().type !== "wall" && node[topLeft+50].node.getPoint().type !== "wall"){
                        neighbors[4] = node[topLeft].node;
                    }
                }else{
                    neighbors[4] = node[topLeft].node;
                }
            }
        }
    }
    if(current.getPoint().x < cols-1 && current.getPoint().y > 0){
        const topRight = getIndex((current.getPoint().x+1), (current.getPoint().y-1), cols);

        if(node[topRight].node.getPoint().type !== "wall" && node[topRight].node.getPoint().type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(node[topRight-1].node.getPoint().type !== "wall" && node[topRight+50].node.getPoint().type !== "wall"){
                        neighbors[5] = node[topRight].node; 
                    }
                }else{
                    neighbors[5] = node[topRight].node; 
                }
            }
        }
    }
    if(current.getPoint().x > 0 && current.getPoint().y < rows-1){
        const bottomLeft  = getIndex((current.getPoint().x-1), (current.getPoint().y+1), cols);

        if(node[bottomLeft].node.getPoint().type !== "wall" && node[bottomLeft].node.getPoint().type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(node[bottomLeft+1].node.getPoint().type !== "wall" && node[bottomLeft-50].node.getPoint().type !== "wall"){
                        neighbors[6] = node[bottomLeft].node;
                    }
                }else{
                    neighbors[6] = node[bottomLeft].node;
                }
            }
        }
    }
    if(current.getPoint().x < cols-1 && current.getPoint().y < rows-1){
        const bottomRight = getIndex((current.getPoint().x+1), (current.getPoint().y+1), cols);

        if(node[bottomRight].node.getPoint().type !== "wall" && node[bottomRight].node.getPoint().type !== "start"){
            if(allowDiags){
                if(!cutCorners){
                    if(node[bottomRight-1].node.getPoint().type !== "wall" && node[bottomRight-50].node.getPoint().type !== "wall"){
                        neighbors[7] = node[bottomRight].node; 
                    }
                }else{
                    neighbors[7] = node[bottomRight].node; 
                }
            }
        }
    }

    return neighbors;
}

function DijkstraBiDirectional(rows, cols, gridMap, memState, setState, cutCorners, allowDiags){
    const [startPoint, endPoints] = getPoints(gridMap);
    const heapFromLeft = new FibonacciHeap();
    const heapFromRight = new FibonacciHeap();
    const cameFromLeft = {};
    const cameFromRight = {}
    const nodeFromLeft = {};
    const nodeFromRight = {};
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

    let goal = endPoints[0];

    if(!startPoint || !endPoints){
        console.log("Map must have a start point, and an end point");
        return "Map must have a start point, and an end point"; 
    }

    gridMap.map((square, index) => {
        if(getIndex(startPoint.x, startPoint.y, cols) === index){
            nodeFromLeft[index] = {dist: 0, node: null};
            cameFromLeft[index] = null;
        }

        if(getIndex(goal.x, goal.y, cols) === index){
            nodeFromRight[index] = {dist: 0, node: null};
            cameFromRight[index] = null;
        }

        if(getIndex(startPoint.x, startPoint.y, cols) !== index){     
            nodeFromLeft[index] =  {dist: Number.POSITIVE_INFINITY, node: null};
            cameFromLeft[index] = null;
        }

        if(getIndex(goal.x, goal.y, cols) !== index){
            nodeFromRight[index] = {dist: Number.POSITIVE_INFINITY, node: null};
            cameFromRight[index] = null;
        }

        const currNode1 = new FibonacciHeapNode(nodeFromLeft[index].dist, square);
        const currNode2 = new FibonacciHeapNode(nodeFromRight[index].dist, square);

        nodeFromLeft[index].node = currNode1;
        nodeFromRight[index].node = currNode2;

        heapFromLeft.insert(nodeFromLeft[index].node);
        heapFromRight.insert(nodeFromRight[index].node);

        return null;
    });

    while(heapFromLeft.getRootList().length > 0 && heapFromRight.getRootList().length > 0){
        const current1 = heapFromLeft.peek();
        const current2 = heapFromRight.peek();
        // console.log("new min",current;

        heapFromLeft.extractMin();
        heapFromRight.extractMin();
        // console.log(Array.from(heap.getRootList()))

        const newState = {
            ...memState,
            grid: memState.grid.map((square, index) => {
                if(current1.getPoint().x === square.x && current1.getPoint().y === square.y){
                    if(current1.getPoint().type !== "start" && current1.getPoint().type !== "end"){
                        memState.grid[index] = {
                            ...memState.grid[index],
                            val: true,
                            type: "neighbors"
                        }
                    }
                    return {...square}
                }
                if(current2.getPoint().x === square.x && current2.getPoint().y === square.y){
                    if(current2.getPoint().type !== "start" && current2.getPoint().type !== "end"){
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

        if(cameFromLeft[getIndex(current2.getPoint().x, current2.getPoint().y, cols)] || cameFromRight[getIndex(current1.getPoint().x, current1.getPoint().y, cols)]){
            let cameFromLeftPoint;
            let cameFromRightPoint;

            if(cameFromLeft[getIndex(current2.getPoint().x, current2.getPoint().y, cols)]){
                cameFromRightPoint = current2.getPoint();
                cameFromLeftPoint = current2.getPoint();
            }else if(cameFromRight[getIndex(current1.getPoint().x, current1.getPoint().y, cols)]){
                cameFromRightPoint = current1.getPoint();
                cameFromLeftPoint = current1.getPoint();
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
        }

        const neighbors1 = getNeighbors(current1, rows, cols, nodeFromLeft, cutCorners, allowDiags);
        const neighbors2 = getNeighbors(current2, rows, cols, nodeFromRight, cutCorners, allowDiags);

        console.log(neighbors2);

        // console.log(neighbors)
        neighbors1.map((neighbor) => {
            // console.log(neighbor);

            const current1Dist = nodeFromLeft[getIndex(current1.getPoint().x, current1.getPoint().y, cols)].dist + dist(current1, neighbor);

            if(current1Dist < nodeFromLeft[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist){

                nodeFromLeft[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist = current1Dist;
                
                cameFromLeft[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)] = current1.getPoint();

                heapFromLeft.decreaseKey(neighbor, nodeFromLeft[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist);

                const newState = {
                    ...memState,
                    grid: memState.grid.map((square, index) => {
                        if(neighbor.getPoint().x === square.x && neighbor.getPoint().y === square.y){
                            if(neighbor.getPoint().type !== "start" && neighbor.getPoint().type !== "end"){
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

            return null;
        })

        neighbors2.map((neighbor) => {
            // console.log(neighbor);

            const current2Dist = nodeFromRight[getIndex(current2.getPoint().x, current2.getPoint().y, cols)].dist + dist(current2, neighbor);

            if(current2Dist < nodeFromRight[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist){

                nodeFromRight[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist = current2Dist;
                
                cameFromRight[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)] = current2.getPoint();

                console.log(neighbor);
                console.log(nodeFromRight[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist);

                heapFromRight.decreaseKey(neighbor, nodeFromRight[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist);

                const newState = {
                    ...memState,
                    grid: memState.grid.map((square, index) => {
                        if(neighbor.getPoint().x === square.x && neighbor.getPoint().y === square.y){
                            if(neighbor.getPoint().type !== "start" && neighbor.getPoint().type !== "end"){
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

            return null;
        })
    }
    
    return states;
}

export default DijkstraBiDirectional;