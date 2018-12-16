import React, { Component } from 'react';
import './App.css';
import MainMenu from './main_menu/MainMenu';
import LocalMap from './local_map/LocalMap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <LocalMap/>
      </div>
    );
  }
}


export default App;
