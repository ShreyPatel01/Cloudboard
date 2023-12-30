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
            resize(); //resizes the canvas when the window loads
            document.addEventListener('mousedown', startPainting);
            document.addEventListener('mouseup', stopPainting);
            document.addEventListener('mousemove', sketch);
            document.addEventListener('click', sketch);
            document.addEventListener('resize', resize);
            
        });
        const drawingMode = {
            'pencil': function(context, coordinates, event){
                context.beginPath();
                context.lineWidth = this.props.size;
                context.lineCap = 'round';
                context.strokeStyle = this.props.color;
                context.moveTo(coordinates.x, coordinates.y);
                getPosition(event);
                context.lineTo(coordinates.x, coordinates.y);
                context.stroke();
            },
            'rectangle': function(context, coordinates, event){
                let rectStartX = coordinates.x;
                let rectStartY = coordinates.y;
                context.lineWidth = this.props.size;
                context.strokeStyle = this.props.color;
                context.moveTo(coordinates.x, coordinates.y);
                getPosition(event);
                context.rect(rectStartX, rectStartY, coordinates.x - rectStartX, coordinates.y - rectStartY);
                context.stroke();
            },
            'eraser': function(context,coordinates,event){
                context.beginPath();
                context.lineWidth = this.props.size;
                context.lineCap = 'round';
                context.strokeStyle = 'white';
                context.moveTo(coordinates.x, coordinates.y);
                getPosition(event);
                context.lineTo(coordinates.x, coordinates.y);
                context.stroke();
            }
        };
        
        const canvas = document.querySelector('#board');
        //Context for the canvas for 2d operations
        const context = canvas.getContext('2d');
        
        //Resizes the canvas
        //Need to change this to one size before implementing sockets
        function resize(){
            context.canvas.width = window.innerWidth;
            context.canvas.height = window.innerHeight;
        }
        
        //Stores initial cursor position
        let coordinates = {x:0, y:0};
        let paint = false;
        
        //Updates cursor co-ordinates when an event is triggered to where the cursor is
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
            if(this.props.drawMode === 'pencil'){
                drawingMode['pencil'].call(this, context, coordinates, event);
            } else if(this.props.drawMode === 'rectangle'){
                drawingMode['rectangle'].call(this,context,coordinates,event);
            }else if(this.props.drawMode === 'eraser'){
                drawingMode['eraser'].call(this,context,coordinates,event);
            }
        }
    }
 
    render() {
        return(
            <canvas className="Whiteboard" id="board"/>
        )
    }
 }
 
 export default Whiteboard;