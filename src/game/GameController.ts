import store from '../store/Store';
import { TIMESTEP_ACTION } from '../store/Actions';
import Game from './Game';

class GameController {
    private gameTimestep: NodeJS.Timeout | undefined;
    private game: Game;

    constructor() {
        this.game = new Game([]); // TODO levelmap

        this.timestep = this.timestep.bind(this);
        this.stop = this.stop.bind(this);
        this.start = this.start.bind(this);
    }

    timestep() {
        const keys = store.getState().keysPressed;
        
        this.game.timestep(keys);
        dispatchTimestep();
    }

    start() {
        if (this.gameTimestep) {
            // already started
            return; 
        }
        this.timestep() 
        this.gameTimestep = setInterval(this.timestep, 2000);
    }

    stop() {
        if (this.gameTimestep) {
            clearTimeout(this.gameTimestep);
            this.gameTimestep = undefined;
        }
    }
}



function dispatchTimestep() {
    store.dispatch({
        type: TIMESTEP_ACTION
    });
}

export default GameController;