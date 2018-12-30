import { 
    UP, 
    DOWN, 
    LEFT, 
    RIGHT, 
    PLAYER_SPEED, 
    SCREEN_HEIGHT, 
    SCREEN_WIDTH, 
    TILE_SIZE,
    IPosition, 
    IDimensions } from "./game_constants";
import store, { getPlayer, ObjectType, maps } from '../store/store';
import { PLAYER_POSITION_CHANGED_ACTION } from "../store/actions";
import { range } from '../utils/utils';
import GameMap from './GameMap';

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

function getNeighbors(row: number, col: number, callback: (r:number, c:number)=>void) {
    [row-1, row, row+1].forEach(r => {
        [col-1, col, col+1].forEach(c => {
            callback(r,c);
        });
    });
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
        Player.timestep(inputs);
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
        if (!this.intersects(r1, r2)){
            return [0, 0];
        }
        v = getNormalVector(v);

        // r1 move horizontally, left or right
        const moveLeftX = - ((r1.x + r1.w) - r2.x); // moving left is a -ve motion
        const moveRightX = (r2.x + r2.w) - r1.x;

        // r1 move vertically, top or bottom
        const moveBottomY = (r2.y + r2.h) - r1.y;
        const moveTopY = -((r1.y + r1.h) - r2.y); // moving top is a -ve motion

        const deltaX = (v[0] > 0) ? moveLeftX : moveRightX;
        const deltaY = (v[1] > 0) ? moveTopY : moveBottomY;

        return [Math.abs(v[0])*deltaX, Math.abs(v[1])*deltaY];
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

    static handleKeys(inputs: string[]): Vector {
        let positionVector: Vector = [0, 0];
        inputs.forEach(key => {
            switch(key) {
                case UP:
                    positionVector = [0, -1];
                    break;
                case DOWN:
                    positionVector = [0, 1];
                    break;
                case LEFT:
                    positionVector = [-1, 0];
                    break;
                case RIGHT:
                    positionVector = [1, 0];
                    break;
            }
        });
        return positionVector;
    }

    static timestep(inputs: string[]) {
        const positionVector = this.handleKeys(inputs);
        const state = store.getState();
        const playerPosition = getPlayer(state).properties.position;

        const positionChangeMagnitude = Math.abs(positionVector[0]) + Math.abs(positionVector[1]);

        if (positionChangeMagnitude > 0) {
            playerPosition.x += positionVector[0]*PLAYER_SPEED;
            playerPosition.y += positionVector[1]*PLAYER_SPEED;

            const map = maps[store.getState().selectedMap];
            
            // next find collisions

            const row = getTileNumber(playerPosition.y);
            const col = getTileNumber(playerPosition.x);
            
            let delta: Vector = [0,0];
            range(0, map.dimensions.numLevels).forEach(l => {
                getNeighbors(row, col, (r, c) => {
                    if (withinRange(map.id, r, c)) {
                        const tileId = GameMap.getTileId(map.id, l, r, c);
                        const obj = map.objects[tileId];
                        if (obj === undefined) {
                            return;
                        }

                        const objectType = TO_TYPE_OBJECT[obj.type];
                        if (!objectType.solid()) {
                            return;
                        }
                    } 
                    
                    // here we are either solid or out of range

                    const delta2 = Rectangle.translationVector(
                        Rectangle.getRectangle(playerPosition),
                        Rectangle.getRectangle({x: c*TILE_SIZE, y: r*TILE_SIZE}),
                        positionVector 
                    );

                    if (Math.abs(delta2[0]) > Math.abs(delta[0])) {
                        delta[0] = delta2[0];
                    }

                    if (Math.abs(delta2[1]) > Math.abs(delta[1])) {
                        delta[1] = delta2[1];
                    }
                });
            });
            
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