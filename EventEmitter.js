

class EventEmitter {

    constructor() {
        this.functionMap = {};
    }

    on(eventName, fn) {
        if(!eventName || eventName.length == 0) {
            throw "event name must have value";
        }

        if(!this.functionMap[eventName]) {
            this.functionMap[eventName] = [fn];
        } else {
            this.functionMap[eventName].push(fn);
        }
    }

    once(eventName, fn) {
        var wrappedFn = (...props) => {
            fn(props);
            this.off(eventName, wrappedFn)
        }

        this.on(eventName, wrappedFn);
    }

    off(eventName, fn) {
        this.validateEventName(eventName);

        const index = this.functionMap[eventName].findIndex(e => e == fn)
        if(index == -1) {
            throw "no such function exist";
        }

        if(this.functionMap[eventName].length === 1) {
            delete this.functionMap[eventName];
        } else {
            this.functionMap[eventName].splice(index, 1);
        }
    }

    trigger(eventName, ...args) {
        this.validateEventName(eventName);

        for (const fn of this.functionMap[eventName]) {
            fn(...args)
        }
    }

    validateEventName(eventName) {
        if(!this.functionMap[eventName]) {
            throw "no such event exist";
        }
    }
}

const func1 = () => console.log("hello");
const eventEmitter = new EventEmitter();
eventEmitter.on('hello', func1)
eventEmitter.on('hello', () => console.log("world"))

eventEmitter.trigger('hello')

console.log("________________")
eventEmitter.off('hello', func1)
eventEmitter.trigger('hello')

console.log("________________")
eventEmitter.on('foo', () => console.log("foo"))
eventEmitter.trigger('foo')

console.log("________________")
try {
    eventEmitter.trigger('bar')
} catch(e) {
    console.log(e)
}

console.log("________________")
eventEmitter.once("foo", () => console.log("bar"))

eventEmitter.trigger('foo')
eventEmitter.trigger('foo')
