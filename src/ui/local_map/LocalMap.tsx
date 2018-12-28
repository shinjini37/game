import React, { Component } from 'react';
import './LocalMap.css';
import Tile from '../tile/Tile';
import CharacterLayer from './CharacterLayer';

import store, { getTileId, maps} from '../../store/Store';
import { IGNORE_TILE } from '../../game/GameConstants';

const range = (upper: number) => {
    return Array.from(new Array(upper), (x, i) => x)
}

class LocalMap extends Component {
    render() {
        const map = maps["map1"];
        const dimensions = map.dimensions;
        return (
            <>
                {range(dimensions.numLevels).map((_, i) => (
                    <MapLayer key={i} layer={i}></MapLayer>
                ))}
                <CharacterLayer />
            </>
        )
    }
}

interface IMapLayerProps {
    layer: number;
}

function MapLayer(props: IMapLayerProps) {
    const map = maps["map1"];
    const dimensions = map.dimensions;
    return (
        <div className="map-layer">
            {range(dimensions.numRows).map((_, i) => (
                <Row key={i} layer={props.layer} row={i}></Row>
            ))}
        </div>
    )
}


interface IRowProps {
    row: number;
    layer: number;
}

function Row(props: IRowProps) {
    const map = maps["map1"];
    const dimensions = map.dimensions;

    const objects = map.objects;
    return (
        <div className="row">
            {range(dimensions.numCols).map((_, i) => {
                const tileId = getTileId("map1", props.layer, props.row, i);
                const properties = (objects[tileId] || {}).properties || {};
                return (
                    <Tile key={i}
                        colorNumber={properties.type_number || IGNORE_TILE}
                        color={properties.color}></Tile>);
            })}
        </div>
    )
}

export default LocalMap;