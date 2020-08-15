import MinHeap from './MinHeap';

function getIndex(x, y, cols){
    return (x + (y * cols));
}

function heuristic(startPoint, endPoint, heuristic){
    //TODO make this a switch for the different types of heuristic functions
    let distance;

    switch (heuristic) {
        case "euclidean":
            distance = Math.sqrt(Math.pow((endPoint.x-startPoint.x), 2) + Math.pow((endPoint.y-startPoint.y), 2));

            break;
        
        case "manhattan":
            distance = Math.abs(startPoint.x-endPoint.x) +  Math.abs(startPoint.y-endPoint.y);

            break;

        default:
            distance = Math.sqrt(Math.pow((endPoint.x-startPoint.x), 2) + Math.pow((endPoint.y-startPoint.y), 2));

            break;
    }
    
    

    return distance;
} 

function dist(startPoint, endPoint){
    //TODO make this a switch for the different types of heuristic functions
    const distance = Math.sqrt(Math.pow((endPoint.x-startPoint.x), 2) + Math.pow((endPoint.y-startPoint.y), 2));     

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

function getNeighbors(point, gridMap, rows, cols){
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

        if((!gridMap[left].val && gridMap[left].type !== "wall" && gridMap[left].type !== "start") || (gridMap[left].val && gridMap[left].type === "end")){
            neighbors[0] = gridMap[left];
        }
    }
    if(point.x < cols-1){
        const right = getIndex((point.x+1), (point.y), cols);

        if((!gridMap[right].val && gridMap[right].type !== "wall" && gridMap[right].type !== "start") || (gridMap[right].val && gridMap[right].type === "end")){
            neighbors[1] = gridMap[right];
        }
    }
    if(point.y > 0){
        const up = getIndex((point.x), (point.y-1), cols);

        if((!gridMap[up].val && gridMap[up].type !== "wall" && gridMap[up].type !== "start") || (gridMap[up].val && gridMap[up].type === "end")){
            neighbors[2] = gridMap[up];
        }
    }
    if(point.y < rows-1){
        const down = getIndex((point.x), (point.y+1), cols);

        if((!gridMap[down].val && gridMap[down].type !== "wall" && gridMap[down].type !== "start") || (gridMap[down].val && gridMap[down].type === "end")){
            neighbors[3] = gridMap[down];
        }
    }
    if(point.x > 0 && point.y > 0){
        const topLeft = getIndex((point.x-1), (point.y-1), cols);

        if((!gridMap[topLeft].val && gridMap[topLeft].type !== "wall" && gridMap[topLeft].type !== "start") || (gridMap[topLeft].val && gridMap[topLeft].type === "end")){
            neighbors[4] = gridMap[topLeft];
        }
    }
    if(point.x < cols-1 && point.y > 0){
        const topRight = getIndex((point.x+1), (point.y-1), cols);

        if((!gridMap[topRight].val && gridMap[topRight].type !== "wall" && gridMap[topRight].type !== "start") || (gridMap[topRight].val && gridMap[topRight].type === "end")){
            neighbors[5] = gridMap[topRight];
        }
    }
    if(point.x > 0 && point.y < rows-1){
        const bottomLeft  = getIndex((point.x-1), (point.y+1), cols);

        if((!gridMap[bottomLeft].val && gridMap[bottomLeft].type !== "wall" && gridMap[bottomLeft].type !== "start") || (gridMap[bottomLeft].val && gridMap[bottomLeft].type === "end")){
            neighbors[6] = gridMap[bottomLeft];
        }
    }
    if(point.x < cols-1 && point.y < rows-1){
        const bottomRight = getIndex((point.x+1), (point.y+1), cols);

        if((!gridMap[bottomRight].val && gridMap[bottomRight].type !== "wall" && gridMap[bottomRight].type !== "start") || (gridMap[bottomRight].val && gridMap[bottomRight].type === "end")){
            neighbors[7] = gridMap[bottomRight];
        }
    }

    return neighbors;
}

function AStar(rows, cols, gridMap, heuristicType){
    const [startPoint, endPoints] = getPoints(gridMap);
    const openSet = new MinHeap();
    const cameFrom = {};
    const gScore = {};
    const fScore = {};

    let goal = null;

    if(!startPoint || !endPoints){
        console.log("Map must have a start point, and an end point");
        return "Map must have a start point, and an end point"; 
    }

    cameFrom[getIndex(startPoint.x, startPoint.y, cols)] = null;

    gScore[getIndex(startPoint.x, startPoint.y, cols)] = 0;

    const endPointDistances = new Array(endPoints.length);

    endPoints.map((endPoint, i) => {
        const hScore = heuristic(startPoint, endPoint, heuristicType); 

        endPointDistances[i] = [endPoint, gScore[getIndex(startPoint.x, startPoint.y, cols)] + hScore];

        return null;
    })

    // console.log(endPointDistances);
    
    endPointDistances.sort((a, b) => {
        if(a[1] > b[1]){
            return 1
        }
        if(a[1] < b[1]){
            return -1
        }

        return 0;
    });

    goal = endPointDistances[0][0];

    fScore[getIndex(startPoint.x, startPoint.y, cols)] = endPointDistances[0][1];

    openSet.insert({point: startPoint, val: fScore[getIndex(startPoint.x, startPoint.y, cols)]});

    while(openSet.getHeap().length !== 0){
        // console.log(openSet.getHeap());
        // console.log(openSet.peek());
        const current = openSet.peek().point;

        // console.log(cameFrom[getIndex(current.x, current.y, cols)]);

        // console.log(current);

        if(current.x === goal.x && current.y === goal.y){
            console.log("PATH FOUND!!!!!");
            return [cameFrom, openSet.getHeap()];
        }

        openSet.extract();

        const neighbors = getNeighbors(current, gridMap, rows, cols);

        neighbors.map((neighbor) => {
            // console.log(neighbor);
            // console.log((gScore[getIndex(current.x, current.y, cols)] + dist(current, neighbor)) + heuristic(neighbor, goal));
            
            // console.log("neighbor", neighbor);
            const currentPathGScore = gScore[getIndex(current.x, current.y, cols)] + dist(current, neighbor);

            if(currentPathGScore < gScore[getIndex(neighbor.x, neighbor.y, cols)] || !gScore[getIndex(neighbor.x, neighbor.y, cols)]){

                cameFrom[getIndex(neighbor.x, neighbor.y, cols)] = current;

                gScore[getIndex(neighbor.x, neighbor.y, cols)] = currentPathGScore;

                const hScore = heuristic(neighbor, goal, heuristicType);
                
                fScore[getIndex(neighbor.x, neighbor.y, cols)] = (gScore[getIndex(neighbor.x, neighbor.y, cols)] + hScore);
                
                if(!openSet.find(neighbor,fScore[getIndex(neighbor.x, neighbor.y, cols)])){
                    openSet.insert({point: neighbor, val: fScore[getIndex(neighbor.x, neighbor.y, cols)]});
                }
                
                return null;
            }
            
            return null; 
        });
    }

    return [cameFrom, openSet.getHeap()];
}

export default AStar