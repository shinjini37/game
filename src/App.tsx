import React, { Component } from 'react';
import { Provider } from 'react-redux';
import MainMenu from './main_menu/MainMenu';
import LocalMap from './local_map/LocalMap';
import InputCapture from './input_capture/InputCapture';
import store from './store/store';

class App extends Component {
    private unsubscribe = () => {};
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {
            console.log(store.getState());
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        return (
            <Provider store={store}>
            <div className="App">
                <LocalMap />
                <InputCapture />
            </div>
            </Provider>
        );
    }
}


export default App;
