window.onload = function () {
		// Get canvas and context
		let canvas = document.getElementById("iso-canvas");
		let context = canvas.getContext("2d");
		let graph_canvas = document.getElementById("graph-canvas");
		let graph_context = graph_canvas.getContext("2d");

		// Fundamental geometric constants
		const SCREEN_WIDTH = canvas.width = graph_canvas.width = 0.75 * window.innerWidth;
		const SCREEN_HEIGHT = canvas.height = graph_canvas.height = 0.75 * window.innerHeight;
		const GRAPH_CELL_LENGTH = 50;
		const TILE_WIDTH = 100;
		const TILE_HEIGHT = 50;
		const ANGLE = Math.atan(TILE_WIDTH / TILE_HEIGHT);

		// Now, for the maximum inscribable diamond we calculate the side lengths.
		// This places a constraint of the maximum number of tiles that can be placed in
		// the iso-space y direction.
		const MAX_ISO_Y = SCREEN_HEIGHT / (2 * Math.cos(ANGLE));

		// We determine the total number of fittable tiles along iso-space y axis by first computing length of a tile side along the iso y-axis.
		const ISO_Y_TILE_LENGTH = Math.sqrt(Math.pow(TILE_WIDTH / 2, 2) + Math.pow(TILE_HEIGHT / 2, 2));

		// Total number of fittable tiles along iso y-axis obtained via:
		const MAX_ISO_Y_TILES = Math.floor(MAX_ISO_Y / ISO_Y_TILE_LENGTH);

		// This is will give the maximum number of fittable tiles in either direction.
		const MAX_X = MAX_ISO_Y_TILES;
		const MAX_Y = MAX_ISO_Y_TILES;

		// Center the context
		context.translate((MAX_X * TILE_WIDTH / 1.5), 1.5);

		// This is the top view of the board as expressed in Cartesian coordinates.
		const topDownGrid = createTileGrid(MAX_X, MAX_Y);
		console.log(topDownGrid);
		drawGrid(topDownGrid, "green");

		function drawGraphLines (cell_length, s_width, s_height) {
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
