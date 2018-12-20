import { createStore, Action } from 'redux';

import * as dotProp from './dot-prop-immutable-reexport';

import { KEY_DOWN_ACTION, KEY_UP_ACTION, PLAYER_POSITION_CHANGED_ACTION } from './Actions';

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

export interface IGameState {
    keysPressed: IKeyPressedState;
    playerId: string;
    maps: {
        [index: string]: { // mapid => list of objectids
            id: string;
            objects: string[]
        }
    }
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
    maps: {},
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
