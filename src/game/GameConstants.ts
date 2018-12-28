
const TILE_SIZE = 32;
const SCREEN_WIDTH = 320;
const SCREEN_HEIGHT = 320;

const PLAYER_SPEED = Math.floor(TILE_SIZE / 2);

const UP = "ArrowUp";
const DOWN = "ArrowDown";
const LEFT = "ArrowLeft";
const RIGHT = "ArrowRight";

const TIMESTEP_DURATION = 75;

const IGNORE_TILE = 0;

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
    IGNORE_TILE };