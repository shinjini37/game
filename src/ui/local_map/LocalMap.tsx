import React, { Component } from 'react';
import './LocalMap.css';
import Tile from '../tile/Tile';
import map1 from '../../assets/maps/map1.json';

class LocalMap extends Component {
    render() {
        return (
            <>{
                map1.map((mapLayer, i) => (
                    <MapLayer key={i} mapLayer={mapLayer}></MapLayer>
                ))
            }</>
        )
    }
}

interface IMapLayerProps {
    mapLayer: number[][];
}

function MapLayer(props: IMapLayerProps) {
    return (
        <div className="map-layer">{
            props.mapLayer.map((row, i) => (
                <Row key={i} tiles={row}></Row>
            ))
        }</div>
    )
}


interface IRowProps {
    tiles: number[];
}

function Row(props: IRowProps) {
    return (
        <div className="row">{
            props.tiles.map((tileColor, i) => (
                <Tile key={i} colorNumber={tileColor}></Tile>
            ))
        }</div>
    )
}

export default LocalMap;