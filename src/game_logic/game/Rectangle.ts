import { 
    TILE_SIZE,
    IPosition, 
    IVector } from "./game_constants";

interface IRectangle {
    x: number;
    y: number;
    w: number;
    h: number;
}

function getNormalizedValue(value: number, magnitude: number): number {
    return (value/Math.sqrt(magnitude));
}

function getNormalVector(v: IVector): IVector {
    const magnitude = Math.abs(v[0]) + Math.abs(v[1]);
    return [getNormalizedValue(v[0], magnitude), getNormalizedValue(v[1], magnitude)];
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

    static translationVector(r1: IRectangle, r2: IRectangle, v: IVector): IVector {
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

export default Rectangle;