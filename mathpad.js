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

// Let's consider a generalized notion isometric transform from a point a_x,y,z in 3D space to a
// point b_x,y in 2D space looking into the first octant. This description can be written via
// rotation matrices:
/*
	|c_x|   | 1   0      0    || cos(B) 0 -sin(B) ||a_x|
	|c_y| = | 0 cos(a) sin(a) ||   0    1    0    ||a_y| where a is rotation about Z and B is rotation
	|c_z|   | 0 -sin(a) cos(a)|| sin(B) 0  cos(B) ||a_z| about X axes respectively.

	The orthographic projection and therefor the points b_x,y are then obtained via:
	|b_x|   | 1 0 0 ||c_x|
	|b_y| = | 0 1 0 ||c_y|
	| 0 |   | 0 0 0 ||c_z|
*/
