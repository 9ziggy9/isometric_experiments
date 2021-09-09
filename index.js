window.onload = function() {
    // Get canvas and context
    let canvas = document.getElementById("iso-canvas");
    let context = canvas.getContext("2d");
    let graph_canvas = document.getElementById("graph-canvas");
    let graph_context = graph_canvas.getContext("2d");

    // SETTING DESIRED SCALE OF TILES
    const CELL_SCALE = 4; // Note the lower the scale, the most tiles.
    const CARTESIAN_TILE_LENGTH = Math.pow(2, CELL_SCALE);

		///////////////////////////////////////////////////////////////////////////////////////
		/*
			SCREEN HANDLING
		*/
		///////////////////////////////////////////////////////////////////////////////////////
    // Screen dimensions MUST be divisible by cell size in order to facilitate clean geometry.
    let SCREEN_WIDTH = canvas.width = graph_canvas.width = Math.floor(0.90 * window.innerWidth);
    let SCREEN_HEIGHT = canvas.height = graph_canvas.height = Math.floor(0.90 * window.innerHeight);
    if (SCREEN_WIDTH % CARTESIAN_TILE_LENGTH) SCREEN_WIDTH -= SCREEN_WIDTH % CARTESIAN_TILE_LENGTH;
    if (SCREEN_HEIGHT % CARTESIAN_TILE_LENGTH) SCREEN_HEIGHT -= SCREEN_HEIGHT % CARTESIAN_TILE_LENGTH;

		//NOTE: There is a bug I believe to be due to the case where SCREEN_WIDTH < 2*SCREEN_HEIGHT
		// handling must be done to preserve the ratio in edge cases.

    console.log(`${SCREEN_WIDTH}, ${SCREEN_HEIGHT} screen dimensions`);
		// END SCREEN HANDLING ///////////////////////////////////////////////////////////////

    // Calculating total cartesian cell count.
    const CARTESIAN_TILE_COUNT = (SCREEN_WIDTH * SCREEN_HEIGHT) / Math.pow(CARTESIAN_TILE_LENGTH, 2);
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
    const ISO_MAX_X = CARTESIAN_Y_COUNT - 6; // NOTE: PADDING ADDED
    const ISO_MAX_Y = CARTESIAN_Y_COUNT - 6; // FOR BLOCK CASE !!!
    console.log(`${ISO_TILE_COUNT} total isometric tiles`);

    // Center the isometric context relative to cartesian context and draw cartesian lines
    context.translate(Math.floor(SCREEN_WIDTH / 2), 64);
    drawGraphLines(CARTESIAN_TILE_LENGTH, SCREEN_WIDTH, SCREEN_HEIGHT);

		run();

		//////////////////////////////////////////////////////////////////////////////////////
		/*
			FUNCTION IMPLEMENTATIONS
		*/
		/////////////////////////////////////////////////////////////////////////////////////

    // Cartesian refernce coordinates. NOTE: This is not a representation of board space,
    // it is merely a reference plot.
    function drawGraphLines(cell_length, s_width, s_height) {
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

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
        context.lineTo(0, ISO_TILE_HEIGHT);
        context.lineTo(-ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
        context.closePath();
        context.fillStyle = color;
        context.fill();

        context.restore();
    }

    function drawBlock(x, y, z) {
        const top = "#eeeeee";
        const right = "#cccccc";
        const left = "#999999";
        context.save();
        // Mapping from tile space to Cartesian coordinates.
        const [cartesianX, cartesianY] = mapToCartesian(x, y);
        context.translate(cartesianX, cartesianY);

        context.beginPath();
        context.moveTo(0, -z * ISO_TILE_HEIGHT);
        context.lineTo(ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2 - z * ISO_TILE_HEIGHT);
        context.lineTo(0, ISO_TILE_HEIGHT - z * ISO_TILE_HEIGHT);
        context.lineTo(-ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2 - z * ISO_TILE_HEIGHT);
        context.closePath();
        context.fillStyle = top;
        context.fill();

        context.beginPath();
        context.moveTo(-ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2 - z * ISO_TILE_HEIGHT);
        context.lineTo(0, ISO_TILE_HEIGHT - z * ISO_TILE_HEIGHT);
        context.lineTo(0, ISO_TILE_HEIGHT);
        context.lineTo(-ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
        context.closePath();
        context.fillStyle = left;
        context.fill();

        // // draw right
        context.beginPath();
        context.moveTo(ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2 - z * ISO_TILE_HEIGHT);
        context.lineTo(0, ISO_TILE_HEIGHT - z * ISO_TILE_HEIGHT);
        context.lineTo(0, ISO_TILE_HEIGHT);
        context.lineTo(ISO_TILE_WIDTH / 2, ISO_TILE_HEIGHT / 2);
        context.closePath();
        context.fillStyle = right;
        context.fill();

        context.restore();
    }

    function mapToCartesian(x, y) {
        const cartesianX = (x - y) * ISO_TILE_WIDTH / 2;
        const cartesianY = (x + y) * ISO_TILE_HEIGHT / 2;
        return [cartesianX, cartesianY];
    }

    function createBoardGrid(limit_x, limit_y) {
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

    function drawBoard(grid, color, draw_mode) {
        for (let y = 0; y < grid.length; y++)
            for (let x = 0; x < grid[0].length; x++) {
								switch (draw_mode) {
								case 'flat':
										if (grid[y][x]) drawTile(x, y, color);
										break;
								case 'block':
										if (grid[y][x]) drawBlock(x, y, Math.random() * 4);
										break;
								}
            }
    }

		function generate() {
				return new Promise(resolve => {
						setTimeout(() => resolve('success: generate frame'), 1000);
				});
		}

		function update() {
				context.clearRect(-Math.floor(SCREEN_WIDTH/2),-64, canvas.width, canvas.height);
				const game_grid = createBoardGrid(ISO_MAX_X, ISO_MAX_Y);
				drawBoard(game_grid, "green", "block");
		}

		async function run() {
				console.log('generating frame ...');
				const result = await generate();
				console.log(result);
				update();
				requestAnimationFrame(run);
		}
}
