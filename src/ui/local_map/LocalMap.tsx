import React, { Component } from 'react';
import './LocalMap.css';
import Tile from '../tile/Tile';
import CharacterLayer from './CharacterLayer';

import { getTileId, maps, IGameState} from '../../store/Store';
import { IGNORE_TILE } from '../../game/GameConstants';
import { connect } from 'react-redux';

const range = (lower: number, upper: number) => {
    const diff = upper - lower + 1;
    return Array.from(new Array(diff), (_, i) => i + lower);
}


interface ILocalMapProps {
    visible: any;
    mapName: string;
}

const LocalMap = connect(mapStateToProps)((props: ILocalMapProps) => {
    const map = maps[props.mapName];
    const dimensions = map.dimensions;
    return (
        <>
            {range(0, dimensions.numLevels).map((level) => (
                <MapLayer visible={props.visible} mapName={props.mapName} key={level} layer={level}></MapLayer>
            ))}
            <CharacterLayer />
        </>
    );
});

interface IMapLayerProps {
    layer: number;
    visible: any;
    mapName: string;
}

const MapLayer = (props: IMapLayerProps) => {
    const map = maps[props.mapName];
    const dimensions = map.dimensions;
    // const startRow = getTileNumber(props.visible.start.y);
    // const endRow = getTileNumber(props.visible.end.y);

    const style = {
        top:  -props.visible.start.y,
        left: -props.visible.start.x
    }

    return (
        <div className="map-layer" style={style}>
            {range(0, dimensions.numRows).map((row) => (
                <Row key={row} mapName={props.mapName} layer={props.layer} row={row}></Row>
            ))}
        </div>
    )
};


interface IRowProps {
    // visible: any;
    row: number;
    layer: number;
    mapName: string;
}

const Row = (props: IRowProps) => {
    const map = maps[props.mapName];
    const dimensions = map.dimensions;

    const objects = map.objects;
    
    // const startCol = getTileNumber(props.visible.start.x);
    // const endCol = getTileNumber(props.visible.end.x);

    return (
        <div className="row">
            {range(0, dimensions.numCols).map((col) => {
                const tileId = getTileId(props.mapName, props.layer, props.row, col);
                const properties = (objects[tileId] || {}).properties || {};
                return (
                    <Tile key={col}
                        colorNumber={properties.type_number || IGNORE_TILE}
                        color={properties.color}></Tile>);
            })}
        </div>
    )
}

function mapStateToProps(state: IGameState) {
    return {
        visible: state.visible,
        mapName: state.selectedMap
    };
}

export default LocalMap;