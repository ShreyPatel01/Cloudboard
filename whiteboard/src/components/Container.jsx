import {Component} from 'react';
import Whiteboard from './Whiteboard';
import './ContainerStyle.css';

class Container extends Component{
    constructor(props){
        super(props);
        this.state = {
            color:'black',
            size:4,
            drawMode: 'pencil'
        };
    };
    pencilDraw(){
        this.setState({
            drawMode: 'pencil'
        });        
    }
    rectangleDraw(){
        this.setState({
            drawMode: 'rectangle'
        });
    }
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
    eraser(){
        this.setState({
            drawMode: 'eraser'
        });
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    CloudBoard
                </div>
                <div className="tool-sidebar">
                    <div className="pencil-mode">
                        <button className="pencil" onClick={this.pencilDraw.bind(this)}>
                            <img src="pencil_icon.jpg" className='icon' alt="pencil"/>
                        </button>
                    </div> 
                    <div className="rectangle-mode">
                        <button className="rectangle" onClick={this.rectangleDraw.bind(this)}>
                            <img src="rectangle_icon.png" className='icon' alt="rectangle"/>
                        </button>
                    </div> 
                    <div className="color-picker">
                        {/* Need to fix this so the entire button can be clicked and the colour change window pops up */}
                        <button className="color-picker">
                            <img src="colour_change_icon.png" className="icon" alt="Change Color"/>
                            <input type="color" id="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                        </button>
                    </div>
                    {/*Resize button for drawing */}
                    <div className="draw-size">
                        <button className="draw-size">
                            <input type="range" id="size" min="1" max="30" value={this.state.size} onChange={this.changeSize.bind(this)}/>
                        </button>
                    </div>
                    {/*Eraser button*/}
                    <div className="draw-eraser">
                        <button className="eraser" onClick={this.eraser.bind(this)}>
                            <img src="eraser_icon.jpg" className="icon" alt="eraser"/>
                        </button>
                    </div>
                </div>
                {/*Whiteboard canvas*/}
                <div className="board">
                    <Whiteboard color={this.state.color} size={this.state.size} eraser={this.state.eraserIsActive} drawMode={this.state.drawMode}/>
                </div>
            </div>
        )
    }
}

export default Container;