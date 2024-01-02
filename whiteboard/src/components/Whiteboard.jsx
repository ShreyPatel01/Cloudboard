import { Component } from "react";
import io from 'socket.io-client';
import ('./WhiteboardStyle.css');
class Whiteboard extends Component {

    timeout;
    socket = io.connect("http://localhost:5000");
    constructor(props){
        super(props);

        this.socket.on('canvas-data',function(data){
            var image = new Image();
            var canvas = document.querySelector('#board');
            var context = canvas.getContext('2d');
            image.onload = function() {
                context.drawImage(image,0,0);

            };
            image.src = data;
        })
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
            var root = this;
            if(!paint || !coordinates) return;
            switch(this.props.drawMode){
                case 'pencil':
                    drawingMode['pencil'].call(this, context, coordinates, event);
                    break;
                case 'eraser':
                    drawingMode['eraser'].call(this,context,coordinates,event);
                    break;
                default:
                    break;
           }

           if (root.timeout !== undefined) clearTimeout(root.timeout);
           root.timeout = setTimeout(function () {
               var base64ImageData = canvas.toDataURL("image/png");
               root.socket.emit("canvas-data", base64ImageData);
           }, 1000);
        }
    }
 
    render() {
        return(
            <canvas className="Whiteboard" id="board"/>
        )
    }
 }
 
 export default Whiteboard;