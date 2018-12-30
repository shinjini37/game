import React, { Component } from 'react';
import { Provider } from 'react-redux';
import InputCapture from './ui/input_capture/InputCapture';
import store from './game_logic/store/store';
import { Unsubscribe } from 'redux';
import GameController from './game_logic/game/GameController';
import Viewport from './ui/viewport/Viewport';

class App extends Component {
    private unsubscribe!: Unsubscribe;
    private gameController: GameController;

    constructor(props: any) {
        super(props);
        this.gameController = new GameController();

        this.startGame = this.startGame.bind(this);
        this.stopGame = this.stopGame.bind(this);
    }

    startGame() {
        this.gameController.start();
    }

    stopGame() {
        this.gameController.stop();
    }

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            // console.log(store.getState());
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Provider store={store}>
            <div className="App">
                <button onClick={this.startGame}>Start Game</button>
                <button onClick={this.stopGame}>Stop Game</button>
                <InputCapture />
                <Viewport />
            </div>
            </Provider>
        );
    }
}

function startGame() {

}

function stopGame() {

}

export default App;
