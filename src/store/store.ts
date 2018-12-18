import { createStore, Action } from 'redux';

import { KEY_PRESSED_ACTION, TIMESTEP_ACTION, PLAYER_POSITION_CHANGED_ACTION } from './Actions';

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}


interface IPosition {
    x: number;
    y: number;
}

interface IGameState {
    keysPressed: string[];
    player: {
        position: IPosition;
        color: string;
    }
}

interface PayloadAction<T> extends Action<T> {
    payload?: any;
}

const initialState: IGameState = {
    keysPressed: [],
    player: {
        position: {
            x: 0,
            y: 0
        },
        color: "red"
    }
}

const reducer = (state: IGameState = initialState, action: PayloadAction<string>): IGameState => {
    console.log("in reducer", action, state);
    switch (action.type) {
        case KEY_PRESSED_ACTION:
            const previousKeys = state.keysPressed;
            const newKey = action.payload.keyPressed;
            const newKeys = [...previousKeys];
            if (previousKeys.indexOf(newKey) < 0) {
                newKeys.push(newKey);
            }
            return Object.assign({}, state, {
                keysPressed: newKeys
            });
        case TIMESTEP_ACTION:
            return Object.assign({}, state, {
                keysPressed: []
            });
        case PLAYER_POSITION_CHANGED_ACTION:
            return Object.assign({}, state, {
                player: {
                    position: action.payload.playerPosition
                }
            });
        default:
            return state;
    }
}

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     /*TODO , savedGameState */);

export default store;