
const TILE_SIZE = 32;
const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;

const PLAYER_SPEED = TILE_SIZE;

const UP = "ArrowUp";
const DOWN = "ArrowDown";
const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";

const TIMESTEP_DURATION = 150;

const IGNORE_TILE = 0;


export type IVector = [number, number];

export interface IPosition {
    x: number;
    y: number;
}

export interface IDimensions {
    width: number;
    height: number;
}

enum ObjectType {
    Grass,
    Rock,
    Water,
    Mountain,
    Player
}

export {
    TILE_SIZE, 
    SCREEN_HEIGHT, 
    SCREEN_WIDTH, 
    UP, 
    DOWN, 
    LEFT, 
    RIGHT, 
    PLAYER_SPEED, 
    TIMESTEP_DURATION, 
    IGNORE_TILE,
    ObjectType };