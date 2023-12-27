import {useState } from 'react';
import Whiteboard from './Whiteboard';
import './ContainerStyle.css';

const Container = () => {
    const[color, setColor] = useState('black');

    const changeColor = (event) => {
        setColor(event.target.value);
    }

    return (
        <div className="container">
            <div className="header">
                CloudBoard
            </div>
            <div className="tool-sidebar">
                <div className="color-picker">
                    <button className="color-picker">
                        <input id="color-picker" type = "color" value={color} onChange= {changeColor}/>
                    </button>
                </div>
            </div>
            <div className="board">
                <Whiteboard color={color}>

                </Whiteboard>
            </div>
        </div>
    )
}

export default Container;