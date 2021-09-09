window.onload = function () {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		const width = canvas.width = 0.75 * window.innerWidth;
		const height = canvas.height = 0.75 * window.innerHeight;
		const TILE_WIDTH = 100;
		const TILE_HEIGHT = 50;

		// This is will give the maximum number of fittable tiles in either direction.
		console.log(width, height);
		const MAX_X = Math.floor(width / TILE_WIDTH);
		console.log(MAX_X);
		const MAX_Y = Math.floor(height / TILE_HEIGHT);
		console.log(MAX_Y);

		// Center the context
		context.translate((MAX_X * TILE_WIDTH) / 2, 0);

		// This is the top view of the board as expressed in Cartesian coordinates.
		const topDownGrid = createTileGrid(MAX_X, MAX_Y);
		console.log(topDownGrid);
		drawGrid(topDownGrid, "green");

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
