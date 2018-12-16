import React, { Component } from 'react'
import './Tile.css'

const TILE_SIZE = 32;

const COLOR_MAP = new Map<number, string>([
    [1, '#a36e28'],
    [2, '#a69162'],
    [10, '#4d9bbd']
])

interface ITileProps {
    colorNumber: number;
}

function Tile (props: ITileProps) {
    const style = {
        backgroundColor: COLOR_MAP.get(props.colorNumber),
        height: TILE_SIZE,
        width: TILE_SIZE,
        display: 'inline-block'
    }
    return (
        <div className="tile" style={style}></div>
    )
}

export default Tile;