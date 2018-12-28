import React, { Component } from 'react';
import './LocalMap.css';
import Tile from '../tile/Tile';
import CharacterLayer from './CharacterLayer';

import { getTileId, maps, IGameState} from '../../store/Store';
import { IGNORE_TILE, TILE_SIZE } from '../../game/GameConstants';
import { connect } from 'react-redux';

const range = (lower: number, upper: number) => {
    const diff = upper - lower + 1;
    return Array.from(new Array(diff), (_, i) => i + lower);
}

// function getTileNumber(value: number) {
//     return Math.floor(value/TILE_SIZE);
// }

const LocalMap = (props: any) => {
    const map = maps[props.mapname];
    const dimensions = map.dimensions;
    return (
        <>
            {range(0, dimensions.numLevels).map((level) => (
                <MapLayer key={level} layer={level}></MapLayer>
            ))}
            <CharacterLayer />
        </>
    );
};

interface IMapLayerProps {
    layer: number;
    visible: any;
}

const MapLayer = connect(mapStateToProps)((props: IMapLayerProps) => {
    const map = maps["map1"];
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
                <Row key={row} layer={props.layer} row={row}></Row>
            ))}
        </div>
    )
});


interface IRowProps {
    // visible: any;
    row: number;
    layer: number;
}

const Row = (props: IRowProps) => {
    const map = maps["map1"];
    const dimensions = map.dimensions;

    const objects = map.objects;
    
    // const startCol = getTileNumber(props.visible.start.x);
    // const endCol = getTileNumber(props.visible.end.x);

    return (
        <div className="row">
            {range(0, dimensions.numCols).map((col) => {
                const tileId = getTileId("map1", props.layer, props.row, col);
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
        visible: state.visible
    };
}

export default LocalMap;