import { TILE_SIZE, UP, DOWN, LEFT, RIGHT } from "./GameConstants";
import store from '../store/Store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/Actions";


class Game {
    constructor(levelmap: number[][]) {
    }

    timestep(inputs: string[]) {
        const playerPosition = store.getState().player.position;
        console.log("in game timestep", playerPosition);
        let positionChanged = false;
        inputs.forEach(key => {
            switch(key) {
                case UP:
                    playerPosition.y -= TILE_SIZE;
                    positionChanged = true;
                    break;
                case DOWN:
                    playerPosition.y += TILE_SIZE;
                    positionChanged = true;
                    break;
                case LEFT:
                    playerPosition.x += TILE_SIZE;
                    positionChanged = true;
                    break;
                case RIGHT:
                    playerPosition.x -= TILE_SIZE;
                    positionChanged = true;
                    break;
            }
        });

        if (positionChanged) {
            store.dispatch({
                type: PLAYER_POSITION_CHANGED_ACTION,
                payload: {
                    playerPosition: {...playerPosition}
                }
            });
        }
    }

    render() {

    }
}

class Sprite {
    constructor() {
    }

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Player extends Sprite {
    constructor() {
        super();
    }

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Ground extends Sprite {
    constructor() {
        super();
    }

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Water extends Sprite {
    constructor() {
        super();
    }

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

export default Game