import { 
    UP, 
    DOWN, 
    LEFT, 
    RIGHT, 
    PLAYER_SPEED, 
    SCREEN_HEIGHT, 
    SCREEN_WIDTH, 
    TILE_SIZE } from "./GameConstants";
import store, { IPosition, IDimensions, getPlayer, ObjectType, maps, getTileId } from '../store/Store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/Actions";

type Vector = [number, number];

function getNormalizedValue(speed: number, magnitude: number): number {
    return (speed/Math.sqrt(magnitude));
}

function getNormalVector(v: Vector): Vector {
    const magnitude = Math.abs(v[0]) + Math.abs(v[1]);
    return [getNormalizedValue(v[0], magnitude), getNormalizedValue(v[1], magnitude)];
}

function getNormalizedSpeed(speed: number, magnitude: number): number {
    // one pixel accuracy is acceptable
    return Math.floor((speed/Math.sqrt(magnitude))*PLAYER_SPEED);
}

function lValue(v: Vector) {
    return (Math.abs(v[0]) + Math.abs(v[1]));
}

function getTileNumber(value: number) {
    return Math.floor(value/TILE_SIZE);
}

function withinRange(mapName: string, row: number, col: number) {
    const dimensions = maps[mapName].dimensions;
    return (
        ((0 <= row) && (row < dimensions.numRows)) &&
        ((0 <= col) && (col < dimensions.numCols))
    );
}

class Game {
    static timestep(inputs: string[]) {
        const state = store.getState();
        const playerPosition = getPlayer(state).properties.position;
        const positionVector: Vector = [0, 0]; // x, y
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

            const map = maps[store.getState().selectedMap];
            
            // next find collisions

            const row = getTileNumber(playerPosition.y);
            const col = getTileNumber(playerPosition.x);
            
            let delta: Vector = [0,0];
            [0, 1].forEach(l => {
                [row-1, row, row+1].forEach(r => {
                    [col-1, col, col+1].forEach(c => {
                        // console.log('one loop --------');
                        // console.log(l, r, c, withinRange(map.id, r, c));
                        
                        if (!withinRange(map.id, r, c)) {
                            
                            // console.log('not within range --------');
                            return;
                        }

                        const tileId = getTileId(map.id, l, r, c);

                        // console.log(tileId);

                        const obj = map.objects[tileId];

                        // console.log(obj);
                        if (obj === undefined) {
                            // console.log('no valid object--------');
                            
                            return;
                        }

                        const objectType = TO_TYPE_OBJECT[obj.type];
                        // console.log(objectType);
                        // console.log(objectType.solid());
                        if (!objectType.solid()) {
                            // console.log('not solid--------');
                            
                            return;
                        }
                        console.log(objectType);
                        
                        const delta2 = Rectangle.translationVector(
                            Rectangle.getRectangle(playerPosition),
                            Rectangle.getRectangle({x: c*TILE_SIZE, y: r*TILE_SIZE}),
                            positionVector 
                        );

                        // if (lValue(delta2) > lValue(delta)) {
                        //     delta = delta2;
                        // }

                        if (Math.abs(delta2[0]) > Math.abs(delta[0])) {
                            delta[0] = delta2[0];
                        }

                        if (Math.abs(delta2[1]) > Math.abs(delta[1])) {
                            delta[1] = delta2[1];
                        }

                        console.log(delta2);
                        console.log('moved --------');
                    });
                });
            });
            
            console.log(delta);
            playerPosition.x += delta[0];
            playerPosition.y += delta[1];

            // next find visible
            const visible = findVisibleRange(playerPosition, 
                {
                    height: map.dimensions.numRows * TILE_SIZE, 
                    width: map.dimensions.numCols * TILE_SIZE
                });

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
        // is r2 to the right of r1
        return (r1.x <= r2.x) && (r2.x < (r1.x + r1.w));
    }

    static bottomOverlap(r1: IRectangle, r2: IRectangle){
        // is r2 to the top of r1
        return (r1.y <= r2.y) && (r2.y < (r1.y + r1.h));
    }

    static intersects(r1: IRectangle, r2: IRectangle){
        // """Check whether `r1` and `r2` overlap.
        // Rectangles are open on the bottom and right sides, and closed on
        // the top and left sides
        // """
        const xOverlap = this.rightOverlap(r1, r2) || this.rightOverlap(r2, r1);
        const yOverlap = this.bottomOverlap(r1, r2) || this.bottomOverlap(r2, r1);
        return xOverlap && yOverlap;
    }

    static translationVector(r1: IRectangle, r2: IRectangle, v: Vector): Vector {
        const noMove: Vector = [0, 0];
        if (!this.intersects(r1, r2)){
            return noMove;
        }

        const oppositeV = [-v[0], -v[1]];
        // r1 move horizontally, left or right
        const moveLeftX = - ((r1.x + r1.w) - r2.x); // moving left is a -ve motion
        const moveRightX = (r2.x + r2.w) - r1.x;

        // r1 move vertically, top or bottom
        const moveBottomY = (r2.y + r2.h) - r1.y;
        const moveTopY = -((r1.y + r1.h) - r2.y); // moving top is a -ve motion

        const deltaX = (oppositeV[0] < 0) ? moveLeftX : moveRightX;
        const deltaY = (oppositeV[1] < 0) ? moveTopY : moveBottomY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return [0, deltaY];
        }

        return [deltaX, 0];
    }

    static translationVector2(r1: IRectangle, r2: IRectangle, v: Vector): Vector {
        const noMove: Vector = [0, 0];
        if (!this.intersects(r1, r2)){
            return noMove;
        }

        const oppositeV = getNormalVector([-v[0], -v[1]]);
        // r1 move horizontally, left or right
        const moveLeftX = - ((r1.x + r1.w) - r2.x); // moving left is a -ve motion
        const moveRightX = (r2.x + r2.w) - r1.x;

        // r1 move vertically, top or bottom
        const moveBottomY = (r2.y + r2.h) - r1.y;
        const moveTopY = -((r1.y + r1.h) - r2.y); // moving top is a -ve motion

        const deltaX = (oppositeV[0] < 0) ? moveLeftX : moveRightX;
        const deltaY = (oppositeV[1] < 0) ? moveTopY : moveBottomY;
        if (oppositeV[0] == 0) {
            // move vertically
            if (oppositeV[1] == 0) {
                return noMove;
            }

            return [0, deltaY];
        }

        if (oppositeV[1] == 0) {
            // move horizontally
            return [deltaX, 0];
        }

        console.log(deltaX, deltaY);
        const delta1: Vector = [deltaX, Math.sqrt(1-(oppositeV[0])**2)*deltaX];
        const delta2: Vector = [Math.sqrt(1-(oppositeV[1])**2)*deltaY, deltaY];
        console.log(delta1, delta2);
        if (lValue(delta1) > lValue(delta2)) {
            return delta2;
        } 
        return delta1;
    }

    static translationVector1(r1: IRectangle, r2: IRectangle){
        // """Compute how much `r1` needs to move to stop intersecting `r2`.
        // If `r1` does not intersect `r2`, return ``[0, 0]``.  Otherwise,
        // return a minimal pair ``[x, y]`` such that translating `r1` by
        // ``[x, y]`` would suppress the overlap. ``[x, y]`` is minimal in
        // the sense of the "L1" distance; in other words, the sum of
        // ``abs(x)`` and ``abs(y)`` should be as small as possible.
        // When two pairs ``[x, y]`` and ``[y, x]`` are tied, return the
        // one with the smallest element first.
        // """
        console.log("x", r1.x, (r1.x + r1.w), r2.x, (r2.x + r2.w));
        console.log("y", r1.y, (r1.y + r1.h), r2.y, (r2.y + r2.h));
        
        if (!this.intersects(r1, r2)){
            return [0, 0];
        }
        // Moving in just one direction should be enough to deal with
        // the overlap

        // r1 move horizontally, left or right
        const moveLeftX = - ((r1.x + r1.w) - r2.x); // moving left is a -ve motion
        const moveRightX = (r2.x + r2.w) - r1.x;

        // r1 move vertically, top or bottom
        const moveBottomY = (r2.y + r2.h) - r1.y;
        const moveTopY = -((r1.y + r1.h) - r2.y); // moving top is a -ve motion

        console.log([moveLeftX, moveRightX]);
        console.log([moveTopY, moveBottomY]);
        
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

abstract class Collidable {
    static solid() {
        return true;
    }
}

class Solid extends Collidable {
}

class NotSolid extends Collidable {
    static solid() {
        return false;
    }
}

class Sprite {
    static collidable: typeof Collidable;

    static solid() {
        return this.collidable.solid();
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
    static collidable = NotSolid;

    timestep(inputs: string[]) {

    }

    render() {
        
    }

    static doThing() {
        return "Player";
    }
}

class Grass extends Sprite {
    static collidable = NotSolid;

    timestep(inputs: string[]) {

    }

    render() {
        
    }

    static doThing() {
        return "Ground";
    }
}

class Water extends Sprite {
    static collidable = Solid;

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Mountain extends Sprite {
    static collidable = Solid;

    timestep(inputs: string[]) {

    }

    render() {
        
    }
}

class Rock extends Sprite {
    static collidable = Solid;

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