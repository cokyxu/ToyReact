import { ToyReact, Component } from "./ToyReact"

class MyComponent extends Component {
    render() {
        return <div>
            <div>cool</div>
            <div>
                Hello{this.children}
            </div>
            <div>World</div>
        </div>
    }
}


let component = <MyComponent  id="a" class="b">
<div>123</div>
<div>我最帅！！！！！！！！！</div>
</MyComponent>

ToyReact.render(component, document.body);


