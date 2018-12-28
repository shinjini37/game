import React, { Component } from 'react'
import './Tile.css'
import { TILE_SIZE, IGNORE_TILE } from '../../game/GameConstants';



interface ITileProps {
    colorNumber: number;
    color: string;
}

function Tile (props: ITileProps) {
    const colorNumber = props.colorNumber;
    const style: any = {
        height: TILE_SIZE,
        width: TILE_SIZE,
    }
    
    if (colorNumber == IGNORE_TILE) {
        return (
            <div className="tile empty" style={style}></div>
        )    
    } 
    style.backgroundColor = props.color;
    return (
        <div className="tile" style={style}></div>
    )
}

export default Tile;