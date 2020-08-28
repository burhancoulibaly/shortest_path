class Queue{
    constructor(node=null){
        this._queue = [];

        if(node === null){
            return;
        }

        this._queue.push(node);

        return;
    }

    peek = () => {
        return this._queue[0];
    }

    length = () => {
        return this._queue.length;
    }

    getQueue = () => {
        return this._queue;
    }

    enqueue = (node) => {
        return this._queue.push(node);
    }

    dequeue = () => {
        return this._queue.shift();
    }

    isEmpty = () => {
        if(this._queue.length > 0){
            return true;
        }

        return false;
    }
}

export default Queue;