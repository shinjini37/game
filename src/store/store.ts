import { createStore, Action } from 'redux';

import { KEY_PRESSED_ACTION, TIMESTEP_ACTION } from './Actions';

declare global {
    interface Window { __REDUX_DEVTOOLS_EXTENSION__: any; }
}

interface IGameState {
    keysPressed: string[];
}

interface PayloadAction<T> extends Action<T> {
    payload?: any;
}

const initialState: IGameState = {
    keysPressed: []
}

const reducer = (state: IGameState = initialState, action: PayloadAction<string>): IGameState => {
    console.log("in reducer", action);
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
        default:
            return state;
    }
}

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     /*TODO , savedGameState */);

export default store;