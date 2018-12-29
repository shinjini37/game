import { createStore, Action } from 'redux';

import * as dotProp from './dot-prop-immutable-reexport';

import { 
    KEY_DOWN_ACTION, 
    KEY_UP_ACTION, 
    PLAYER_POSITION_CHANGED_ACTION } from './Actions';

import map1 from '../assets/maps/map1.json';
import {
    SCREEN_WIDTH, 
    SCREEN_HEIGHT, 
    IGNORE_TILE } from '../game/GameConstants';

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}

export interface IPosition {
    x: number;
    y: number;
}

export interface IDimensions {
    width: number;
    height: number;
}

enum ObjectType {
    Grass,
    Rock,
    Water,
    Mountain,
    Player
}

interface IKeyPressedState {
    [index: string]: boolean;
}

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

interface IMap {
    id: string;
    objects: ITile;
    dimensions: {
        numLevels: number,
        numRows: number,
        numCols: number
    }
}

export interface IGameState {
    keysPressed: IKeyPressedState;
    playerId: string;
    selectedMap: string;
    visible: any;
    objects: {
        [index: string]: { // objectId => any properties
            id: string;
            type: ObjectType;
            properties: any;
        }
    }
}

function getPlayer(state: IGameState) {
    const playerId = state.playerId;
    return state.objects[playerId];
}

interface PayloadAction<T> extends Action<T> {
    payload?: any;
}

const PLAYER_ID = "player";

const initialState: IGameState = {
    keysPressed: {},
    playerId: PLAYER_ID,
    selectedMap: "map1",
    visible: {
        start: {
            x: 0,
            y: 0
        },
        end: {
            x: SCREEN_WIDTH,
            y: SCREEN_HEIGHT
        }
    },
    objects: {
        [PLAYER_ID]: {
            id: PLAYER_ID,
            type: ObjectType.Player,
            properties: {
                position: {
                    x: 0,
                    y: 0
                },
                color: {value:"red"}
            }
        }
    }
};

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

function digestMap(mapname: string, levelmap: MapLayer[]): IMap {
    const levelMapDict: ITile = {};
    const numLevels = levelmap.length;
    const numRows = levelmap[0].length;
    const numCols = levelmap[0][0].length;
    levelmap.forEach((mapLayer: MapLayer, level: number) => {
        mapLayer.forEach((mapRow: number[], row: number) => {
            mapRow.forEach((mapTileNumber: number, col: number) => {
                if (mapTileNumber != IGNORE_TILE) {
                    const name = getTileId(mapname, level, row, col);
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

const maps: {[index: string]: IMap} = {
    "map1": digestMap("map1", map1)
};

function getTileId(mapName:string, level:number, row:number, col:number) {
    return  `${mapName}(${level}, ${row}, ${col})`;
}

const reducer = (state: IGameState = initialState, action: PayloadAction<string>): IGameState => {
    switch (action.type) {
        case KEY_DOWN_ACTION: {
            const newKeys = handleKey(state.keysPressed, action.payload.key, false);
            return dotProp.set(state, 'keysPressed', newKeys);
        }
        case KEY_UP_ACTION: {
            const newKeys = handleKey(state.keysPressed, action.payload.key, true);
            return dotProp.set(state, 'keysPressed', newKeys);
        }
        case PLAYER_POSITION_CHANGED_ACTION:
            const newState1 = dotProp.set(
                state,
                `objects.${PLAYER_ID}.properties.position`,
                action.payload.playerPosition
            );
            const newState2 = dotProp.set(
                newState1,
                `visible`,
                action.payload.visible
            );
            return newState2;
        default:
            return state;
    }
}

function handleKey(previousKeys: IKeyPressedState, newKey: string, removing: boolean) {
    const newKeys = { ...previousKeys };
    if (removing) {
        if (newKeys.hasOwnProperty(newKey)) {
            delete newKeys[newKey];
        }
    } else {
        newKeys[newKey] = true;
    }

    return newKeys;
}

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     /*TODO , savedGameState */);

export default store;
export { getTileId, maps, ObjectType, getPlayer};