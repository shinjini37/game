import React, { Component } from 'react';
import { TILE_SIZE } from '../../game/GameConstants';


function Character(props: any) {
    const style = {
        height: TILE_SIZE,
        width: TILE_SIZE,
        top: props.position.y,
        left: props.position.x
    }
    return (
        <div style={style} className="character" ></div>
    )
}

function CharacterLayer(props: any) {
    return (
        <Character position={[0,0]}></Character>
    )
}

function mapStateToProps(state: any) {
    return {
        position: state.player.position
    };
}

export default CharacterLayer;