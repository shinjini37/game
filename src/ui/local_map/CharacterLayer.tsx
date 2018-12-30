import React, { Component } from 'react';
import { TILE_SIZE } from '../../game_logic/game/game_constants';
import { connect } from 'react-redux';
import store, { IGameState, getPlayer } from '../../game_logic/store/store';

const _Character = function (props: any) {
    const style = {
        height: TILE_SIZE,
        width: TILE_SIZE,
        top: props.position.y - props.visible.start.y,
        left: props.position.x - props.visible.start.x
    }
    return (
        <div style={style} className="character" ></div>
    )
}

const Character = connect(mapStateToProps)(_Character);

function CharacterLayer(props: any) {
    return (
        <Character></Character>
    )
}

function mapStateToProps(state: IGameState) {
    return {
        position: getPlayer(state).properties.position,
        visible: state.visible
    };
}

export default CharacterLayer;