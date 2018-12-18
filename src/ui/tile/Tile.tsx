import React, { Component } from 'react'
import './Tile.css'
import { TILE_SIZE } from '../../game/GameConstants';

const COLOR_MAP = new Map<number, string>([
    [0, ''],
    [1, '#a36e28'],
    [2, '#a69162'],
    [10, '#4d9bbd'],
    [20, '#703227'],
])

interface ITileProps {
    colorNumber: number;
}

function Tile (props: ITileProps) {
    const colorNumber = props.colorNumber;
    const style: any = {
        height: TILE_SIZE,
        width: TILE_SIZE,
        display: 'inline-block'
    }
    
    if (colorNumber == 0) {
        return (
            <div className="tile empty" style={style}></div>
        )    
    } 
    style.backgroundColor = COLOR_MAP.get(props.colorNumber);
    return (
        <div className="tile" style={style}></div>
    )
}

export default Tile;