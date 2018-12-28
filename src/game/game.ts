import { 
    UP, 
    DOWN, 
    LEFT, 
    RIGHT, 
    PLAYER_SPEED, 
    SCREEN_HEIGHT, 
    SCREEN_WIDTH, 
    TILE_SIZE, 
    IGNORE_TILE } from "./GameConstants";
import store, { IPosition, IDimensions, getPlayer, getTileId} from '../store/Store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/Actions";

function getNormalizedSpeed(speed: number, magnitude: number): number {
    return (speed/Math.sqrt(magnitude))*PLAYER_SPEED
}

type MapLayer = number[][];
interface ILevelMapDict {
    [index: string]: IMapTileObject; // "mapname(level, x, y)" => MapTileObject
}

interface IMapTileObject {
    id: string;
    properties: any;
}

const TYPE_MAP: {[index: number]: string} = {
    1: "grass",
    2: "rock",
    10: "water",
    20: "mountain"
};

const COLOR_MAP: {[index: number]: string} = {
    1: '#a36e28',
    2: '#a69162',
    10: '#4d9bbd',
    20: '#703227',
};


class Game {
    static digestMap(levelmap: MapLayer[]) {
        const levelMapDict: ILevelMapDict = {};
        const numLevels = levelmap.length;
        const numRows = levelmap[0].length;
        const numCols = levelmap[0][0].length;
        levelmap.forEach((mapLayer: MapLayer, level: number) => {
            mapLayer.forEach((mapRow: number[], row: number) => {
                mapRow.forEach((mapTileNumber: number, col: number) => {
                    if (mapTileNumber != IGNORE_TILE) {
                        const name = getTileId("map1", level, row, col);
                        levelMapDict[name] = {
                            id: name,
                            properties: {
                                type: TYPE_MAP[mapTileNumber],
                                type_number: mapTileNumber,
                                color: COLOR_MAP[mapTileNumber]
                            }
                        }; 
                    }
                });
            });
        });

        const dimensions = {
            numLevels,
            numRows,
            numCols
        }

        const objects = levelMapDict;
        return {dimensions, objects};
    }

    timestep(inputs: string[]) {
        const playerPosition = getPlayer(store.getState()).properties.position;
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


            const visible = findVisibleRange(playerPosition, {width: 25*TILE_SIZE, height: 12*TILE_SIZE});

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

    static doThing() {
        return "Sprite";
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

    static doThing() {
        return "Player";
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

    static doThing() {
        return "Ground";
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

function findVisibleRange(playerPosition: IPosition, mapDimensions: IDimensions) {
    // We will assume that the map is always bigger than the viewport
    const halfWidth = Math.floor(SCREEN_WIDTH/2); // let's keep everything as integers
    const halfHeight = Math.floor(SCREEN_HEIGHT/2); // and assume the width and height are even numbers

    let startx, starty, endx, endy;

    startx = playerPosition.x - halfWidth;
    endx = playerPosition.x + halfWidth;
    starty = playerPosition.y - halfHeight;
    endy = playerPosition.y + halfHeight;

    if (playerPosition.x < halfWidth) {
        startx = 0;
        endx = SCREEN_WIDTH;
    }
    if (playerPosition.x > (mapDimensions.width - halfWidth)) {
        endx = mapDimensions.width;
        startx = mapDimensions.width - SCREEN_WIDTH;
    }

    if (playerPosition.y < halfHeight) {
        starty = 0;
        endy = SCREEN_HEIGHT;
    }
    if (playerPosition.y > (mapDimensions.height - halfHeight)) {
        endy = mapDimensions.height;
        starty = mapDimensions.height - SCREEN_HEIGHT; 
    }

    return [[startx, starty], [endx, endy]]
}

const TYPESTRING_TO_TYPE: {[index: string]: typeof Sprite}
 = {
    "player": Player,
    "ground": Ground
}

export default Game