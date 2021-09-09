window.onload = function () {
		// Get canvas and context
		let canvas = document.getElementById("iso-canvas");
		let context = canvas.getContext("2d");
		let graph_canvas = document.getElementById("graph-canvas");
		let graph_context = graph_canvas.getContext("2d");

		// Screen dimensions MUST be divisible by 2 in order to facilitate clean geometry.
		let SCREEN_WIDTH = canvas.width = graph_canvas.width = Math.floor(0.75 * window.innerWidth);
		let SCREEN_HEIGHT = canvas.height = graph_canvas.height = Math.floor(0.75 * window.innerHeight);
		if (SCREEN_WIDTH % 2) SCREEN_WIDTH--;
		if (SCREEN_HEIGHT % 2) SCREEN_HEIGHT--;

		// Sizes for cartesian tiles given in powers of 2 exclusively.
		const CELL_EXP = 3;
		const CARTESIAN_TILE_LENGTH = Math.pow(2, CELL_EXP);

		// Isometric tile widths and heights, also note angle.
		const TILE_WIDTH = 100;
		const TILE_HEIGHT = 50;
		const ANGLE = Math.atan(TILE_WIDTH / TILE_HEIGHT);

		// Now, for the maximum inscribable diamond we calculate the side lengths.
		// This places a constraint of the maximum number of tiles that can be placed in
		// the iso-space y direction.
		const TOTAL_ISO_TILES = SCREEN_HEIGHT / (2 * Math.cos(ANGLE));

		// We determine the total number of fittable tiles along iso-space y axis by first computing length of a tile side along the iso y-axis.
		const ISO_Y_TILE_LENGTH = Math.sqrt(Math.pow(TILE_WIDTH / 2, 2) + Math.pow(TILE_HEIGHT / 2, 2));

		// Total number of fittable tiles along iso y-axis obtained via:
		const TOTAL_ISO_TILES_TILES = Math.floor(TOTAL_ISO_TILES / ISO_Y_TILE_LENGTH);

		// This is will give the maximum number of fittable tiles in either direction.
		const MAX_X = TOTAL_ISO_TILES_TILES;
		const MAX_Y = TOTAL_ISO_TILES_TILES;

		// Center the context
		context.translate((MAX_X * TILE_WIDTH / 1.5), 1.5);

		drawGraphLines(CARTESIAN_TILE_LENGTH, SCREEN_WIDTH, SCREEN_HEIGHT);

		// This is the top view of the board as expressed in Cartesian coordinates.
		const topDownGrid = createTileGrid(MAX_X, MAX_Y);
		console.log(topDownGrid);
		drawGrid(topDownGrid, "green");

		function drawGraphLines (cell_length, s_width, s_height) {
				let last_x_coordinate = Math.floor(s_width / cell_length);
				let last_y_coordinate = Math.floor(s_height / cell_length);
				for (let x = 0; x <= last_x_coordinate; x++) {
						graph_context.moveTo(x * cell_length, 0);
						graph_context.lineTo(x * cell_length, last_y_coordinate * cell_length);
						graph_context.strokeStyle = "darkgray";
						graph_context.stroke();
				}
				for (let y = 0; y <= last_y_coordinate; y++) {
						graph_context.moveTo(0, y * cell_length);
						graph_context.lineTo(last_x_coordinate * cell_length, y * cell_length);
						graph_context.strokeStyle = "darkgray";
						graph_context.stroke();
				}
		}

		function drawTile(x, y, color) {
				context.save();

				// Mapping from tile space to Cartesian coordinates.
				const [cartesianX, cartesianY] = mapToCartesian(x, y);
				context.translate(cartesianX, cartesianY);

				// Drawing boundary of isometric tiles.
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
				context.lineTo(0, TILE_HEIGHT);
				context.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
				context.closePath();
				context.fillStyle = color;
				context.fill();

				context.restore();
		}

		function mapToCartesian(x, y) {
				const cartesianX = (x - y) * TILE_WIDTH / 2;
				const cartesianY = (x + y) * TILE_HEIGHT / 2;
				return [cartesianX, cartesianY];
		}

		function createTileGrid(limit_x, limit_y) {
				// Forming 2-dimensional grid
				let grid = new Array(limit_x);
				for (let i = 0; i < limit_x; i++)
						grid[i] = new Array(limit_y);
				//Populating grid.
				for (let j = 0; j < grid.length; j++)
						for (let i = 0; i < grid[0].length; i++)
								grid[j][i] = 1;
				return grid;
		}

		function drawGrid(grid, color) {
				for (let y = 0; y < grid.length; y++)
						for (let x = 0; x < grid[0].length; x++) {
								if (grid[y][x]) drawTile(x, y, color);
						}
		}

}

