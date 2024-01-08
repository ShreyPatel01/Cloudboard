import { Component } from "react";
import io from 'socket.io-client';
import ('./WhiteboardStyle.css');
class Whiteboard extends Component {

    timeout;
    socket = io.connect("http://35.189.76.43:5000");
    startX;
    startY;
    finalX;
    finalY;
    rectDraw;
    circleDraw;
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
        });
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
                drawFree.call(this, context, coordinates, event, this.props.color);
            },
            'eraser': function(context,coordinates,event){
                drawFree.call(this, context, coordinates, event, 'white');
            },
            'rectangle': function(context, startX, startY, width, height, strokeStyle){
                drawRect.call(this, context, startX, startY, width, height, strokeStyle);
            },
            'circle': function(context, startX,startY, endX, endY, strokeStyle){
                drawCircle.call(this,context,startX,startY,endX,endY,strokeStyle);
            }
        };

        function drawFree(context, coordinates, event, strokeStyle){
            context.beginPath();
            context.lineWidth = this.props.size;
            context.lineCap = 'round';
            context.strokeStyle = strokeStyle;
            context.moveTo(coordinates.x, coordinates.y);
            getPosition(event);
            context.lineTo(coordinates.x, coordinates.y);
            context.stroke();
        }

        function drawRect(context, startX, startY, width, height, strokeStyle){
            context.beginPath();
            context.lineWidth = this.props.size;
            context.lineCap = 'round';
            context.strokeStyle = strokeStyle;
            context.rect(startX, startY, width, height);
            context.stroke();
            context.closePath();
        }

        function drawCircle(context, startX, startY, finalX, finalY, strokeStyle){
            context.beginPath();
            context.lineWidth = this.props.size;
            context.strokeStyle = strokeStyle;
            var radius = Math.sqrt(Math.pow(finalX - startX, 2) + Math.pow(finalY - startY, 2));
            context.arc(startX, startY, radius, 0, 2* Math.PI);
            context.stroke();
        }

        function lastCreatedObject(){
            switch(this.props.drawMode){
                case 'pencil':
                    return{
                        type: 'pencil',
                        startX: this.startX,
                        startY: this.startY,
                        endX: coordinates.x,
                        endY: coordinates.y,
                        strokeStyle: this.props.color,
                        lineWidth: this.props.size
                    };
                case 'rectangle':
                    return{
                        type: 'rectangle',
                        startX: this.startX,
                        startY: this.startY,
                        width: (this.finalX - this.startX),
                        height: this.finalY - this.startY,
                        strokeStyle: this.props.color,
                        lineWidth: this.props.size
                    };
                case 'circle':
                    return{
                        type: 'circle',
                        startX: this.startX,
                        startY: this.startY,
                        endX: this.finalX,
                        endY: this.finalY,
                        strokeStyle: this.props.color,
                        lineWidth: this.props.size
                    };
                default:
                    break;
            }
        }
        
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
        
        let startPainting = (event) =>{
            paint=true;
            getPosition(event);
            switch(this.props.drawMode){
                case 'rectangle':
                    paint = true;
                    this.startX = event.clientX;
                    this.startY = event.clientY;
                    this.rectDraw = true;
                    break;
                case 'circle':
                    paint=true;
                    this.startX = event.clientX;
                    this.startY = event.clientY;
                    this.circleDraw = true;
                    break;
                default:
                    break;
            }
       }

        let stopPainting = (event) =>{
            paint=false;
            switch (this.props.drawMode){
                case 'rectangle':
                    this.finalX = event.clientX;
                    this.finalY = event.clientY;
                    this.rectDraw = false;
                    let width = this.finalX - this.startX;
                    let height = this.finalY - this.startY;
                    drawingMode['rectangle'].call(this,context,this.startX,this.startY,width,height, this.props.color);
                    break;
                case 'circle':
                    this.finalX = event.clientX;
                    this.finalY = event.clientY;
                    this.circleDraw = false;
                    drawingMode['circle'].call(this,context,this.startX,this.startY,this.finalX,this.finalY,this.props.color);
                    break;
                default:
                    break;
           }
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
               //emits an event with the last object created
               root.socket.emit("objectCreated", lastCreatedObject);
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