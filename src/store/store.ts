import { createStore, Action } from 'redux';

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
        case "KeysPressed":
            return Object.assign({}, state, {
                keysPressed: action.payload.keys
            })
        default:
            return state
    }
}

const store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
     /*TODO , savedGameState */);

export default store;