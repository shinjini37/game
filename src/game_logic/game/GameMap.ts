import { IGNORE_TILE, ObjectType } from './game_constants';

type MapLayer = number[][];

const TYPE_MAP: {[index: number]: ObjectType} = {
    1: ObjectType.Grass,
    2: ObjectType.Rock,
    10: ObjectType.Water,
    20: ObjectType.Mountain
};

const COLOR_MAP: {[index: number]: string} = {
    1: '#a36e28',
    2: '#a69162',
    10: '#4d9bbd',
    20: '#703227',
};

interface ITile {
    [index: string]: {
        id: string;
        type: ObjectType,
        properties: {
            type_number: number,
            color: string
        }
    }
}

export interface IGameMap {
    id: string;
    objects: ITile;
    dimensions: {
        numLevels: number,
        numRows: number,
        numCols: number
    }
}

class GameMap {
    static digestMap(mapname: string, levelmap: MapLayer[]): IGameMap {
        const levelMapDict: ITile = {};
        const numLevels = levelmap.length;
        const numRows = levelmap[0].length;
        const numCols = levelmap[0][0].length;
        levelmap.forEach((mapLayer: MapLayer, level: number) => {
            mapLayer.forEach((mapRow: number[], row: number) => {
                mapRow.forEach((mapTileNumber: number, col: number) => {
                    if (mapTileNumber != IGNORE_TILE) {
                        const name = this.getTileId(mapname, level, row, col);
                        levelMapDict[name] = {
                            id: name,
                            type: TYPE_MAP[mapTileNumber],
                            properties: {
                                type_number: mapTileNumber,
                                color: COLOR_MAP[mapTileNumber]
                            }
                        }; 
                    }
                });
            });
        });
    
        const dimensions = {
            numLevels,
            numRows,
            numCols
        }
        const objects = levelMapDict;
        return {id: mapname, dimensions, objects};
    }

    static getTileId(mapName:string, level:number, row:number, col:number) {
        return  `${mapName}(${level}, ${row}, ${col})`;
    }
}
export default GameMap;