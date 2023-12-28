import {Component} from 'react';
import Whiteboard from './Whiteboard';
import './ContainerStyle.css';

class Container extends Component{
    constructor(props){
        super(props);
        this.state = {
            color:'black',
            size:4,
            eraserIsActive:false
        };
    };

    changeColor(event){
        this.setState({
            color: event.target.value
        });
    }
    changeSize(event){
        this.setState({
            size: event.target.value
        });
    }
    eraser(event){
        this.setState({
            color:'white',
            eraserIsActive: !this.state.eraserIsActive
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
                    <div className="draw-size">
                        <button className="draw-size">
                            <input type="range" id="size" min="1" max="20" value={this.state.size} onChange={this.changeSize.bind(this)}/>
                        </button>
                    </div>
                    <div className="draw-eraser">
                        <button className="eraser" onClick={this.eraser.bind(this)}>
                            <img src="eraser_icon.jpg" className="icon" alt="eraser"/>
                        </button>
                    </div>
                </div>
                <div className="board">
                    <Whiteboard color={this.state.color} size={this.state.size}/>
                </div>
            </div>
        )
    }
}

export default Container;