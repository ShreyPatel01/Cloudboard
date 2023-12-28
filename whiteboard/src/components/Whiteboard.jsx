import { Component } from "react";

import ('./WhiteboardStyle.css')
class Whiteboard extends Component {
    constructor(props){
        super(props);
    }
 
    componentDidMount(){
        this.drawOnCanvas();
    }
 
    //Method to draw on the board
    drawOnCanvas(){
        window.addEventListener('load', ()=>{
            resize();
            document.addEventListener('mousedown', startPainting);
            document.addEventListener('mouseup', stopPainting);
            document.addEventListener('mousemove', sketch);
            document.addEventListener('click', sketch);
            document.addEventListener('resize', resize);
            
        });
        
        const canvas = document.querySelector('#board');
        const context = canvas.getContext('2d');
        
        function resize(){
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight;
        }
        
        let coordinates = {x:0, y:0};
        let paint = false;
        
        function getPosition(event){
            coordinates.x = event.clientX - canvas.offsetLeft;
            coordinates.y = event.clientY - canvas.offsetTop;
        }
        
        function startPainting(event){
            paint=true;
            getPosition(event);
        }

        function stopPainting(){
            paint=false;
        }

        let sketch = (event) => {
            if(!paint) return;
            context.beginPath();
        
            context.lineWidth = 4;
        
            context.lineCap = 'round';
            context.strokeStyle = this.props.color;
        
            context.moveTo(coordinates.x, coordinates.y);
        
            getPosition(event);
        
            context.lineTo(coordinates.x, coordinates.y);
        
            context.stroke();
        }
    }
 
    render() {
        return(
            <canvas className="Whiteboard" id="board"/>
        )
    }
 }
 
 export default Whiteboard;