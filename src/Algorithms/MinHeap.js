class MinHeap{
    constructor(heap){
        if(!heap){
            this._heap = [];

            //build min-heap
            this.minHeap();

            return;
        }

        if(!heap.length){
            this._heap = [];
            this._heap.push(heap);

            //build min-heap
            this.minHeap();

            return;  
        }

        this._heap = heap;

        //build min-heap
        this.minHeap();
        
        return;
    }

    getHeap = () => {
        return this._heap;
    }

    parentPos = (pos) => {
        return parseInt((pos - 1) / 2);
    }

    leftChildPos = (pos) => {
        return parseInt((2 * pos) + 1);
    }

    rightChildPos = (pos) => {
        return parseInt((2 * pos) + 2);
    }

    insert = (val) => {
        this._heap.push(val);

        let pos = this._heap.length-1;

        if(this._heap.length <= 1){
            return;
        }

        while(this.parentPos(pos) >= 0 && this._heap[pos].val < this._heap[this.parentPos(pos)].val){
            this.swap(pos, this.parentPos(pos));

            pos = this.parentPos(pos);
        }

        return;
    }

    peek = () => {
        if(this.isEmpty()){
            return;
        }
        
        return this._heap[0];
    }

    extract = () => {
        if(this._heap.length === 0){
            return;
        }

        const min = this._heap.shift();
        this._heap.unshift(this._heap[this._heap.length-1]);
        this._heap.pop();


        if(this._heap.length <= 1){
            return min;
        };

        this.minHeapify(0);

        return min;
    }

    find = (val, point) => {
        if(!val || !point){
            return;
        }

        for(let i = 0; i < this._heap.length; i++){
            if(this._heap[i].val === val && this._heap[i].point.x === point.x && this._heap[i].point.y === point.y){
                return i;
            }
        }

        return;
    }

    delete = (val, point) => {
        for(let i = 0; i < this._heap.length; i++){
            if(this._heap[i].val === val && this._heap[i].point.x === point.x && this._heap[i].point.y === point.y){
                if(this._heap.length === 1){
                    this._heap.pop();

                    return;
                }

                const tmp = this._heap[i];

                this._heap[i] = this._heap[this._heap.length-1];
                this._heap[this._heap.length-1] = tmp;
                this._heap.pop()

                return this.minHeapify(i);
            }
        }

        return;
    }

    replace = (val, point) => {
        for(let i = 0; i < this._heap.length; i++){
            if(this._heap[i].val === val && this._heap[i].point.x === point.x && this._heap[i].point.y === point.y){
                if(this._heap.length === 1){
                    this._heap.pop();

                    return;
                }

                this._heap[i] = point;

                let pos = i;

                while(this.parentPos(pos) >= 0 && this._heap[pos].val < this._heap[this.parentPos(pos)].val){
                    this.swap(pos, this.parentPos(pos));
        
                    pos = this.parentPos(pos);
                }

                break;
            }
        }

        return;
    }

    swap = (pos1, pos2) => {
        const tmp = this._heap[pos1];
        
        this._heap[pos1] = this._heap[pos2];
        this._heap[pos2] = tmp;

        return;
    }

    isEmpty = () => {
        if(this._heap.length === 0){
            return true;
        }

        return false;
    }

    size = () => {
        return this._heap.length.toString();
    }

    minHeapify = (pos) => {
        if(this.leftChildPos(pos) < this._heap.length){
            if(this.rightChildPos(pos) < this._heap.length){
                if(this._heap[pos].val > this._heap[this.leftChildPos(pos)].val ||  this._heap[pos].val > this._heap[this.rightChildPos(pos)].val){
                    if(this._heap[this.leftChildPos(pos)].val < this._heap[this.rightChildPos(pos)].val){
                        this.swap(pos, this.leftChildPos(pos));
                        return this.minHeapify(this.leftChildPos(pos));
                    }
        
                    this.swap(pos, this.rightChildPos(pos));
                    return this.minHeapify(this.rightChildPos(pos));;
                }
            }

            if(this._heap[pos].val > this._heap[this.leftChildPos(pos)].val){
                this.swap(pos, this.leftChildPos(pos));
                return this.minHeapify(this.leftChildPos(pos)); 
            }
        }
        
        return;
    }

    minHeap = () => {
        if(this._heap.length === 0){
            return;
        }

        for(let pos = parseInt(this._heap.length/2)-1; pos >= 0; pos--){
            this.minHeapify(pos);
        }

        return;
    }
}

export default MinHeap;