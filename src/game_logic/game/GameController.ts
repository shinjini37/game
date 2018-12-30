import store from '../store/store';
import Game from './Game';
import { TIMESTEP_DURATION } from './game_constants';


class GameController {
    private gameTimestep: NodeJS.Timeout | undefined;

    constructor() {
        this.timestep = this.timestep.bind(this);
        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);
    }

    timestep() {
        const keys = store.getState().keysPressed;
        
        Game.timestep(keys);
    }

    start() {
        if (this.gameTimestep) {
            // already started
            return; 
        }
        this.timestep();
        this.gameTimestep = setInterval(this.timestep, TIMESTEP_DURATION);
    }

    stop() {
        if (this.gameTimestep) {
            clearTimeout(this.gameTimestep);
            this.gameTimestep = undefined;
        }
    }
}

export default GameController;