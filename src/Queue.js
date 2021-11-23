class Queue {
    constructor() {
        this.internal_queue = [];
        this.autoDequeue = true;
    }
    queue(callback) {
        // console.log('queue', this.internal_queue);
        this.internal_queue.push(callback);
        if (this.autoDequeue) {
            // console.log('above autoDequeue');
            this.autoDequeue = false;
            this.dequeue();
        }
    }
    dequeue() {
        // console.log('dequeue', this.internal_queue);
        if (this.internal_queue.length > 0) {
            let item = this.internal_queue.shift();
            item()
        } else {
            this.autoDequeue = true;
        }
    }
}
window.Queue = Queue
export default { Queue }