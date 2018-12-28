import { 
    UP, 
    DOWN, 
    LEFT, 
    RIGHT, 
    PLAYER_SPEED, 
    SCREEN_HEIGHT, 
    SCREEN_WIDTH, 
    TILE_SIZE } from "./GameConstants";
import store, { IPosition, IDimensions, getPlayer, ObjectType } from '../store/Store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/Actions";

function getNormalizedSpeed(speed: number, magnitude: number): number {
    // one pixel accuracy is acceptable
    return Math.floor((speed/Math.sqrt(magnitude))*PLAYER_SPEED);
}

class Game {
    static timestep(inputs: string[]) {
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

        console.log(Rectangle.translationVector(
            Rectangle.getRectangle(playerPosition),
            Rectangle.getRectangle({x: TILE_SIZE, y: TILE_SIZE}))
        );

        const positionChangeMagnitude = Math.abs(positionVector[0]) + Math.abs(positionVector[1]);

        if (positionChangeMagnitude > 0) {
            playerPosition.x += getNormalizedSpeed(positionVector[0], positionChangeMagnitude);
            playerPosition.y += getNormalizedSpeed(positionVector[1], positionChangeMagnitude);


            const visible = findVisibleRange(playerPosition, {width: 25*TILE_SIZE, height: 12*TILE_SIZE});

            store.dispatch({
                type: PLAYER_POSITION_CHANGED_ACTION,
                payload: {
                    playerPosition: {...playerPosition},
                    visible: {...visible}
                }
            });
        }
    }

    render() {

    }
}

interface IRectangle {
    x: number;
    y: number;
    w: number;
    h: number;
}

class Rectangle {
    // """A rectangle object to help with collision detection and resolution."""

    static getRectangle(position: IPosition): IRectangle {
        return {
            x: position.x,
            y: position.y,
            h: TILE_SIZE,
            w: TILE_SIZE
        }
    }

    static rightOverlap(r1: IRectangle, r2: IRectangle) {
        return r1.x <= r2.x && r2.x < (r1.x + r1.w);
    }

    static upOverlap(r1: IRectangle, r2: IRectangle){
        return r1.y <= r2.y && r2.y < (r1.y + r1.h);
    }

    static intersects(r1: IRectangle, r2: IRectangle){
        // """Check whether `r1` and `r2` overlap.
        // Rectangles are open on the top and right sides, and closed on
        // the bottom and left sides; concretely, this means that the
        // rectangle [0, 0, 1, 1] does not intersect either of [0, 1, 1, 1]
        // or [1, 0, 1, 1].
        // """
        const xOverlap = Rectangle.rightOverlap(r1, r2) || Rectangle.rightOverlap(r2, r1);
        const yOverlap = Rectangle.upOverlap(r1, r2) || Rectangle.upOverlap(r2, r1);
        return xOverlap && yOverlap;
    }

    static translationVector(r1: IRectangle, r2: IRectangle){
        // """Compute how much `r1` needs to move to stop intersecting `r2`.
        // If `r1` does not intersect `r2`, return ``[0, 0]``.  Otherwise,
        // return a minimal pair ``[x, y]`` such that translating `r1` by
        // ``[x, y]`` would suppress the overlap. ``[x, y]`` is minimal in
        // the sense of the "L1" distance; in other words, the sum of
        // ``abs(x)`` and ``abs(y)`` should be as small as possible.
        // When two pairs ``[x, y]`` and ``[y, x]`` are tied, return the
        // one with the smallest element first.
        // """
        if (!Rectangle.intersects(r1, r2)){
            return [0, 0];
        }
        // Moving in just one direction should be enough to deal with
        // the overlap

        // r1 move horizontally, left or right
        const moveLeftX = - ((r1.x + r1.w) - r2.x); // moving left is a -ve motion
        const moveRightX = (r2.x + r2.w) - r1.x;

        // r1 move vertically, top or bottom
        const moveBottomY = -((r2.y + r2.h) - r1.y); // moving bottom is a -ve motion
        const moveTopY = (r1.y + r1.h) - r2.y;
        
        let res = [moveLeftX, moveBottomY];
        [moveLeftX, 0, moveRightX].forEach(x => {
            [moveBottomY, 0, moveTopY].forEach(y => {
                if (x == 0 && y == 0){
                    return;
                }
                const newL1 = (Math.abs(x) + Math.abs(y))
                const currentL1 = (Math.abs(res[0]) + Math.abs(res[1]))
                if (newL1 > currentL1){
                    return;
                }
                if (newL1 == currentL1) {
                    if (Math.abs(x) > Math.abs(res[0])){
                        return;
                    }
                }
                res = [x, y];
            });
        });
        return res;
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

class Collidable {
    static collide(other: Collidable) {
        return ;
    }
}

class Grass extends Sprite {
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

class Mountain extends Sprite {
    constructor() {
        super();
    }

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Rock extends Sprite {
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

    return {
        start: {
            x: startx, 
            y: starty
        }, end: {
            x: endx, 
            y: endy
        }
    }
}

const TO_TYPE_OBJECT: {[index: number]: typeof Sprite}
 = {
    [ObjectType.Player]: Player,
    [ObjectType.Grass]: Grass,
    [ObjectType.Water]: Water,
    [ObjectType.Mountain]: Mountain,
    [ObjectType.Rock]: Rock
}

export default Game;