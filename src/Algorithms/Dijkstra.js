import FibonacciHeapNode from '../Algorithms/FibonacciHeapNode';
import FibonacciHeap from '../Algorithms/FibonacciHeap';

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

function Dijkstra(rows, cols, gridMap, memState, setState, cutCorners, allowDiags){
    const [startPoint, endPoints] = getPoints(gridMap);
    const heap = new FibonacciHeap();
    const cameFrom = {};
    const node = {};
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

    if(!startPoint || endPoints.length === 0){
        console.log("Map must have a start point, and an end point");
        return null; 
    }

    gridMap.map((square, index) => {
        if(getIndex(startPoint.x, startPoint.y, cols) === index){
            node[index] = {dist: 0, node: null};
            cameFrom[index] = null
        }

        if(getIndex(startPoint.x, startPoint.y, cols) !== index){
            node[index] = {dist: Number.POSITIVE_INFINITY, node: null};
            cameFrom[index] = null
        }

        const currNode = new FibonacciHeapNode(node[index].dist, square);
        node[index].node = currNode;
        heap.insert(currNode);

        return null;
    });

    while(heap.getRootList().length > 0){
        const current = heap.peek();
        // console.log("new min",current;

        heap.extractMin();
        // console.log(Array.from(heap.getRootList()))

        const newState = {
            ...memState,
            grid: memState.grid.map((square, index) => {
                if(current.getPoint().x === square.x && current.getPoint().y === square.y){
                    if(current.getPoint().type !== "start" && current.getPoint().type !== "end"){
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

        if(current.getPoint().x === goal.x && current.getPoint().y === goal.y){
            const state = states[states.length-1];
            setState({
                // return {
                ...state,
                //state object is immutable so updates have to be done this way
                grid: state.grid.map((square, index) => {
                    if(cameFrom[index]){
                        if(square.type === "end"){
                            let prev = cameFrom[index];
                
                            while(prev){                   
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

        const neighbors = getNeighbors(current, rows, cols, node, cutCorners, allowDiags);

        // console.log(neighbors)
        neighbors.map((neighbor) => {
            // console.log(neighbor);

            const currentDist = node[getIndex(current.getPoint().x, current.getPoint().y, cols)].dist + dist(current, neighbor);

            if(currentDist < node[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist){

                node[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist = currentDist;
                
                cameFrom[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)] = current.getPoint();

                heap.decreaseKey(neighbor, node[getIndex(neighbor.getPoint().x, neighbor.getPoint().y, cols)].dist);

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

export default Dijkstra;