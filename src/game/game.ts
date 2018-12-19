import { TILE_SIZE, UP, DOWN, LEFT, RIGHT, PLAYER_SPEED } from "./GameConstants";
import store from '../store/Store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/Actions";

function getNormalizedSpeed(speed: number, magnitude: number): number {
    return (speed/Math.sqrt(magnitude))*PLAYER_SPEED
}


class Game {
    constructor(levelmap: number[][]) {
    }

    timestep(inputs: string[]) {
        const playerPosition = store.getState().player.position;
        const positionVector = [0, 0]; // x, y
        inputs.forEach(key => {
            switch(key) {
                case UP:
                    positionVector[1] -= 1;
                    break;
                case DOWN:
                    positionVector[1] += 1;
                    break;
                case LEFT:
                    positionVector[0] -= 1;
                    break;
                case RIGHT:
                    positionVector[0] += 1;
                    break;
            }
        });

        const positionChangeMagnitude = Math.abs(positionVector[0]) + Math.abs(positionVector[1]);

        if (positionChangeMagnitude > 0) {
            playerPosition.x += getNormalizedSpeed(positionVector[0], positionChangeMagnitude);
            playerPosition.y += getNormalizedSpeed(positionVector[1], positionChangeMagnitude);

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