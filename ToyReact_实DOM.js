
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            console.log(RegExp.$1, value)
            let eventName = RegExp.$1.replace(/^[\s\S]/, s => s.toLowerCase());
            console.log(eventName)
            this.root.addEventListener(eventName, value);
        }
        if(name === "className") {
            name = "class"
        }
        this.root.setAttribute(name, value);
    }

    appendChild(vchild) {
        let range = document.createRange();
        if(this.root.children.length) {
            range.setStartAfter(this.root.lastChild);
            range.setEndAfter(this.root.lastChild);
        } else {
            range.setStart(this.root, 0);
            range.setEnd(this.root, 0);
        }
        vchild.mountTo(range);
        // vchild.mountTo(this.root);
    }

    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root)
    }
}

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type);
    }

    mountTo(range) {
        range.deleteContents();
        range.insertNode(this.root);
        // parent.appendChild(this.root)
    }
}

export class Component {
    constructor() {
        this.children = [];
        this.props = Object.create(null);
    }
    setAttribute(name, value) {
        if(name.match(/^on([\s\S]+)$/)) {
            console.log("component", RegExp.$1);
            // this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, s => s.toLocaleLowerCase()), value)
        }
        this.props[name] = value;
        this[name] = value;
    }
    mountTo(range) {
        this.range = range;
        this.update();

        // let range = document.createRange();
        // range.setStartAfter(parent.lastChild);
        // range.setEndAfter(parent.lastChild);
    }
    update() {
        let placeholder = document.createComment("placeholder");
        let range = document.createRange();
        range.setStart(this.range.endContainer, this.range.endOffset);
        range.setEnd(this.range.endContainer, this.range.endOffset);
        range.insertNode(placeholder);

        this.range.deleteContents();
        let vdom = this.render();
        vdom.mountTo(this.range);
    }
    appendChild(child) {
        this.children.push(child);
    }
    setState(state) {
        let merge = (oldState, newState) => {
            for(let p in newState) {
                if(typeof newState[p] === "object" && newState[p] !== null) {
                    if(typeof oldState[p] !== "object") {
                        if(newState[p] instanceof Array) {
                            oldState[p] = []
                        } else {
                            oldState[p] = {}
                        }
                    }
                    merge(oldState[p], newState[p]);
                } else {
                    oldState[p] = newState[p];
                }
            }
        }

        if(!this.state && state) {
            this.state = {};
        }
        merge(this.state, state);
        this.update();
        console.log(this.state);
    }
}

export let ToyReact = {
    createElement: function createElement(type, attributes, ...children) {
        let element;

        if (typeof type === "string") {
            element = new ElementWrapper(type);
        } else {
            element = new type();
        }

        for (let key in attributes) {
            element.setAttribute(key, attributes[key]);
        }

        let insertChildren = (children) => {
            for (let child of children) {
                if (typeof child === "object" && child instanceof Array) {
                    insertChildren(child);
                } else {
                    if(child === null || child === void(0)) {
                        child = "";
                    }
                    if (!(child instanceof Component)
                        && !(child instanceof ElementWrapper)
                            && !(child instanceof TextWrapper)) {
                                child = String(child);
                    }
                    if (typeof child === "string") {
                        child = new TextWrapper(child);
                    }
                    element.appendChild(child);
                }

            }
        }

        insertChildren(children);


        return element;
    },
    render(vdom, element) {
        let range = document.createRange();
        if(element.children.length) {
            range.setStartAfter(element.lastChild);
            range.setEndAfter(element.lastChild);
        } else {
            range.setStart(element, 0);
            range.setEnd(element, 0);
        }
        vdom.mountTo(range);
    }
}