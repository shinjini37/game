import { createStore, Action } from 'redux';

import * as dotProp from './dot-prop-immutable-reexport';

import { 
    KEY_DOWN_ACTION, 
    KEY_UP_ACTION, 
    PLAYER_POSITION_CHANGED_ACTION } from './actions';

import map1 from '../../assets/maps/map1.json';
import {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    ObjectType } from '../game/game_constants';

import GameMap, { IGameMap } from '../game/GameMap';

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}


type IKeyPressedState = string[];


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
    keysPressed: [],
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
                positionDiff: {
                    x: 0,
                    y: 0
                },
                color: {value:"red"}
            }
        }
    }
};

const maps: {[index: string]: IGameMap} = {
    "map1": GameMap.digestMap("map1", map1)
};

const reducer = (state: IGameState = initialState, action: PayloadAction<string>): IGameState => {
    switch (action.type) {
        case KEY_DOWN_ACTION: {
            const newKeys = handleKey(state.keysPressed, action.payload.key, true);
            return dotProp.set(state, 'keysPressed', newKeys);
        }
        case KEY_UP_ACTION: {
            const newKeys = handleKey(state.keysPressed, action.payload.key, false);
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
            const newState3 = dotProp.set(
                newState2,
                `objects.${PLAYER_ID}.properties.positionDiff`,
                action.payload.playerPositionDiff
            );
            return newState3;
        default:
            return state;
    }
}

function handleKey(previousKeys: IKeyPressedState, newKey: string, adding: boolean) {
    // Adds new keys to the end.
    const newKeys: IKeyPressedState = [];

    // copy everything other than the key
    previousKeys.forEach(key => {
        if (key != newKey) {
            newKeys.push(key);
        }
    });

    // only add if not already there
    if (adding) {
        newKeys.push(newKey);
    }

    return newKeys;
}

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     /*TODO , savedGameState */);

export default store;
export { maps, ObjectType, getPlayer };