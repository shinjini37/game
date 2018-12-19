import React, { Component } from 'react';
import { TILE_SIZE } from '../../game/GameConstants';
import { connect } from 'react-redux';

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

function mapStateToProps(state: any) {
    return {
        position: state.player.position
    };
}

export default CharacterLayer;