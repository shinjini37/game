import React, { Component } from 'react';
import { TILE_SIZE } from '../../game/GameConstants';
import { connect } from 'react-redux';
import { IGameState, getPlayer } from '../../store/Store';

const _Character = function (props: any) {
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

const Character = connect(mapStateToProps)(_Character);

function CharacterLayer(props: any) {
    return (
        <Character></Character>
    )
}

function mapStateToProps(state: IGameState) {
    return {
        position: getPlayer(state).properties.position
    };
}

export default CharacterLayer;