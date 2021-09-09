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
		console.log(`${SCREEN_WIDTH}, ${SCREEN_HEIGHT} screen dimensions`);

		// Length of cartesian tiles given in powers of 2 exclusively.
		const CELL_SCALE = 5; // Note the lower the scale, the most tiles.
		const CARTESIAN_TILE_LENGTH = Math.pow(2, CELL_SCALE);
		const CARTESIAN_TILE_COUNT = (SCREEN_WIDTH*SCREEN_HEIGHT) / Math.pow(CARTESIAN_TILE_LENGTH, 2);
		console.log(`${CARTESIAN_TILE_COUNT} cartesian tiles rendered`);

		// Isometric tile widths and heights, also note angle.
		const ISO_TILE_WIDTH = 2 * CARTESIAN_TILE_LENGTH;
		const ISO_TILE_HEIGHT = CARTESIAN_TILE_LENGTH;
		// Calculating interior half angle for future refernce.
		const ANGLE = Math.atan(ISO_TILE_WIDTH / ISO_TILE_HEIGHT);

		// Note that since the isometric edge tiles grows like the diagonal tiles, to obtain the total
		// number of isometric tiles we need only square the number of vertical cartesian tiles from top
		// to bottom.
		const CARTESIAN_Y_COUNT = SCREEN_HEIGHT / CARTESIAN_TILE_LENGTH;
		const ISO_TILE_COUNT = Math.pow(CARTESIAN_Y_COUNT, 2);
		console.log(`${ISO_TILE_COUNT} total isometric tiles`);

		// Center the context
		context.translate((MAX_X * ISO_TILE_WIDTH / 1.5), 1.5);

		drawGraphLines(CARTESIAN_TILE_LENGTH, SCREEN_WIDTH, SCREEN_HEIGHT);

		// This is the top view of the board as expressed in Cartesian coordinates.
		const topDownGrid = createTileGrid(MAX_X, MAX_Y);
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
				context.lineTo(ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
				context.lineTo(0, ISO_TILE_HEIGHT);
				context.lineTo(-ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
				context.closePath();
				context.fillStyle = color;
				context.fill();

				context.restore();
		}

		function mapToCartesian(x, y) {
				const cartesianX = (x - y) * ISO_TILE_WIDTH / 2;
				const cartesianY = (x + y) * ISO_TILE_HEIGHT / 2;
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

