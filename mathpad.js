// ASSUMPTION, SCREEN WIDTH IS GREATER THAN SCREEN HEIGHT
const SCREEN_HEIGHT = 500;
const SCREEN_WIDTH = 1000;

// Given width and height of inscribed tile we want to calculate the upper half interior angle.
const TILE_WIDTH = 100;
const TILE_HEIGHT = 50;
const ANGLE = Math.atan(TILE_WIDTH / TILE_HEIGHT);
console.log(ANGLE);

// Now, for the maximum inscribable diamond we calculate the side lengths.
// This places a constraint of the maximum number of tiles that can be placed in
// the iso-space y direction.
const MAX_ISO_Y = SCREEN_HEIGHT / (2 * Math.cos(ANGLE));
console.log(MAX_ISO_Y);

// We determine the total number of fittable tiles along iso-space y axis by first computing length of a tile side along the iso y-axis.
const ISO_Y_TILE_LENGTH = Math.sqrt(Math.pow(TILE_WIDTH / 2, 2) + Math.pow(TILE_HEIGHT / 2, 2))
console.log(ISO_Y_TILE_LENGTH);
// Total number of fittable tiles along iso y-axis obtained via:
const MAX_ISO_Y_TILES = Math.floor(MAX_ISO_Y / ISO_Y_TILE_LENGTH);
console.log(MAX_ISO_Y_TILES);
