import React, { Component } from 'react'
import LocalMap from '../local_map/LocalMap';
import InGameMenu from '../in_game_menu/InGameMenu';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/GameConstants';
import './Viewport.css';

function Viewport(props: any) {
    const style = {
        height: SCREEN_HEIGHT,
        width: SCREEN_WIDTH
    };

    return (
        <div className="viewport" style={style}>
            <LocalMap />
            <InGameMenu />        
        </div>
    )
}

export default Viewport;