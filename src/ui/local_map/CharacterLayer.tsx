import React from 'react';
import { TILE_SIZE, TIMESTEP_DURATION } from '../../game_logic/game/game_constants';
import { connect } from 'react-redux';
import { IGameState, getPlayer } from '../../game_logic/store/store';

const Character = connect(mapStateToProps)((props: any) => {
    const transitionProperties = `${TIMESTEP_DURATION}ms`;
    const style = {
        height: TILE_SIZE,
        width: TILE_SIZE,
        top: props.position.y - props.visible.start.y,
        left: props.position.x - props.visible.start.x,
        // transition: `top ${transitionProperties}, left ${transitionProperties}`,
        // transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0px)`,
        // transition: `transform ${transitionProperties}`
    }
    // console.log(style.transition);
    return (
        <div style={style} className="character" ></div>
    )
});

function CharacterLayer(props: any) {
    return (
        <Character></Character>
    )
}

function mapStateToProps(state: IGameState) {
    return {
        position: getPlayer(state).properties.position,
        visible: state.visible,
        positionDiff: getPlayer(state).properties.positionDiff
    };
}

export default CharacterLayer;