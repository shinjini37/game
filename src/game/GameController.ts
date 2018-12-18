import store from '../store/Store';
import { TIMESTEP_ACTION } from '../store/Actions';

class GameController {
    private gameTimestep: NodeJS.Timeout | undefined;

    start() {
        if (this.gameTimestep) {
            // already started
            return; 
        }
        dispatchTimestep() 
        this.gameTimestep = setInterval(dispatchTimestep, 2000);
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