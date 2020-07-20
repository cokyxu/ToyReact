
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(vchild) {
        vchild.mountTo(this.root);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

class TextWrapper {
    constructor(type) {
        this.root = document.createTextNode(type);
    }

    mountTo(parent) {
        parent.appendChild(this.root)
    }
}

export class Component {
    constructor() {
        this.children = [];
    }
    setAttribute(name, value) {
        this[name] = value;
    }
    mountTo(parent) {
        let vdom = this.render();
        vdom.mountTo(parent);
    }
    appendChild(child) {
        this.children.push(child);
    }
}

export let ToyReact = {
    createElement: function createElement(type, attributes, ...children) {
        console.log(arguments)
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
                    if (!(children instanceof Component)
                        && !(children instanceof ElementWrapper)
                            && !(children instanceof TextWrapper)) {
                        children = String(child);
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
        vdom.mountTo(element);
    }
}