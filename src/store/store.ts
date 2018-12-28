import { createStore, Action } from 'redux';

import * as dotProp from './dot-prop-immutable-reexport';

import { KEY_DOWN_ACTION, KEY_UP_ACTION, PLAYER_POSITION_CHANGED_ACTION } from './Actions';
import Game from '../game/Game';

import map1 from '../assets/maps/map1.json';

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

interface IKeyPressedState {
    [index: string]: boolean;
}

export interface ITile {
    [index: string]: {
        id: string;
        properties: {
            type: string,
            type_number: number,
            color: string
        }
    }
}

export interface IMap {
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
    objects: {
        [index: string]: { // objectId => any properties
            id: string;
            properties: any;
        }
    }
}

export function getPlayer(state: IGameState) {
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
    objects: {
        [PLAYER_ID]: {
            id: PLAYER_ID,
            properties: {
                position: {
                    x: 0,
                    y: 0
                },
                color: "red"
            }
        }
    }
};

// (() => {
//     const {dimensions, objects} = Game.digestMap(map1);
//     const mapName = "map1";
//     initialState.maps[mapName] = {
//         id: mapName,
//         dimensions: dimensions,
//         objects: []
//     };

//     Object.keys(objects).forEach((id: string) => {
//         initialState.maps[mapName].objects.push(id);
//         initialState.objects[id] = objects[id];
//     });

// })();

export const maps: {[index: string]: IMap} = {
    "map1": Game.digestMap("map1", map1)
};

export function getTileId(mapName:string, level:number, row:number, col:number) {
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
            return dotProp.set(
                state,
                `objects.${PLAYER_ID}.properties.position`,
                action.payload.playerPosition
            );
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
