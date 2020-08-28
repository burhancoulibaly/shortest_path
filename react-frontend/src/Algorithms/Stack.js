class Stack{
    constructor(node=null){
        this._stack = [];

        if(node === null){
            return;
        }

        this._stack.push(node);

        return;
    }

    top = () => {
        return this._stack[this._stack.length-1];
    }

    length = () => {
        return this._stack.length;
    }

    getStack = () => {
        return this._stack;
    }

    push = (node) => {
        return this._stack.push(node);
    }

    pop = () => {
        return this._stack.pop();
    }

    isEmpty = () => {
        if(this._stack.length > 0){
            return true;
        }

        return false;
    }
}

export default Stack;