import {Component} from 'react';
import Whiteboard from './Whiteboard';
import './ContainerStyle.css';

class Container extends Component{
    constructor(props){
        super(props);
        this.state = {
            color:'black'
        };
    };

    changeColor(event){
        this.setState({
            color: event.target.value
        });
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    CloudBoard
                </div>
                <div className="tool-sidebar">
                    <div className="color-picker">
                        <button className="color-picker">
                            <input type="color" id="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                        </button>
                    </div>
                </div>
                <div className="board">
                    <Whiteboard color={this.state.color}/>
                </div>
            </div>
        )
    }
}

export default Container;