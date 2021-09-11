window.onload = function() {
    // Get canvas and context
    let canvas = document.getElementById("iso-canvas");
    let context = canvas.getContext("2d");
    let graph_canvas = document.getElementById("graph-canvas");
    let graph_context = graph_canvas.getContext("2d");

    // SETTING DESIRED SCALE OF TILES
    let CELL_SCALE = 5.5; // Note the lower the scale, the most tiles.
    const CARTESIAN_TILE_LENGTH = Math.pow(2, CELL_SCALE);

    ///////////////////////////////////////////////////////////////////////////////////////
    /*
    	SCREEN HANDLING
    */
    ///////////////////////////////////////////////////////////////////////////////////////
    // Screen dimensions MUST be divisible by cell size in order to facilitate clean geometry.
    let SCREEN_WIDTH = canvas.width = graph_canvas.width = 30 * CARTESIAN_TILE_LENGTH;
    let SCREEN_HEIGHT = canvas.height = graph_canvas.height = 15 * CARTESIAN_TILE_LENGTH;

    console.log(`${SCREEN_WIDTH}, ${SCREEN_HEIGHT} screen dimensions`);
    // END SCREEN HANDLING ///////////////////////////////////////////////////////////////

    // Calculating total cartesian cell count.
    const CARTESIAN_TILE_COUNT = (SCREEN_WIDTH * SCREEN_HEIGHT)
					                       / Math.pow(CARTESIAN_TILE_LENGTH, 2);
    console.log(`${CARTESIAN_TILE_COUNT} cartesian tiles rendered`);

    // Isometric tile widths and heights, also note angle.
    const ISO_TILE_WIDTH = 2 * CARTESIAN_TILE_LENGTH;
    const ISO_TILE_HEIGHT = CARTESIAN_TILE_LENGTH;

    const CARTESIAN_Y_COUNT = SCREEN_HEIGHT / CARTESIAN_TILE_LENGTH;
    const ISO_TILE_COUNT = Math.pow(CARTESIAN_Y_COUNT, 2);
    const ISO_MAX_X = Math.floor(0.75 * Math.sqrt(ISO_TILE_COUNT));
    const ISO_MAX_Y = Math.floor(0.75 * Math.sqrt(ISO_TILE_COUNT));
    console.log(`${ISO_TILE_COUNT} total isometric tiles`);

    let TIME_STEP = 300;
		let FRAME_COUNT = 0;

    // Center the isometric context relative to cartesian context and draw cartesian lines
    context.translate(Math.floor(SCREEN_WIDTH / 2),
											CARTESIAN_TILE_LENGTH * 4);

    drawGraphLines(CARTESIAN_TILE_LENGTH,
									 SCREEN_WIDTH,
									 SCREEN_HEIGHT,
									 graph_context);

    ////////////////////////////////////////////////////////////////////////////////////////
    /*
    EVENT HANDLING
    */
    ////////////////////////////////////////////////////////////////////////////////////////
    const spec_field = document.getElementById('set-button');
    spec_field.addEventListener('click', (event) => {
        event.preventDefault();
        let freq_field = document.getElementById('freq-box');
        TIME_STEP = freq_field.value;
        console.log(TIME_STEP);
    });

    ///////////////////////////////////////
    // !!!! RUN THE GOD DAMN THING !!!! //
    /////////////////////////////////////
    run();

    ////////////////////////////////////////////////////////////////////////////////////////
    /*
			RUNTIME FUNCTIONS
    */
    ////////////////////////////////////////////////////////////////////////////////////////
    function generateFrame(period) {
        return new Promise(resolve => {
            setTimeout(() => resolve('success: generate frame'), period);
        });
    }

    function update() {
        //Remember, when clearing we have previously translated context.
        context.clearRect(-Math.floor(SCREEN_WIDTH / 2),
            -CARTESIAN_TILE_LENGTH * 4,
            canvas.width,
            canvas.height);
        const game_grid = createBoardGrid(ISO_MAX_X, ISO_MAX_Y);
        drawBoard(game_grid, ISO_TILE_WIDTH, ISO_TILE_HEIGHT, "green", "block", context);
    }

    async function run() {
        const result = await generateFrame(TIME_STEP);
        update();
				FRAME_COUNT++;
				requestAnimationFrame(run);
    }
}

//////////////////////////////////////////////////////////////////////////////////////
/*
	FUNCTION IMPLEMENTATIONS
	NOTE: In order to truly decouple this file, you must be running a server in order to
	import contents of functions.js.
*/
/////////////////////////////////////////////////////////////////////////////////////

// Cartesian refernce coordinates. NOTE: This is not a representation of board space,
// it is merely a reference plot.
function drawGraphLines(cell_length, s_width, s_height, context) {
    let last_x_coordinate = Math.floor(s_width / cell_length);
    let last_y_coordinate = Math.floor(s_height / cell_length);
    for (let x = 0; x <= last_x_coordinate; x++) {
        context.moveTo(x * cell_length, 0);
        context.lineTo(x * cell_length, last_y_coordinate * cell_length);
        context.strokeStyle = "#b58900";
        context.stroke();
    }
    for (let y = 0; y <= last_y_coordinate; y++) {
        context.moveTo(0, y * cell_length);
        context.lineTo(last_x_coordinate * cell_length, y * cell_length);
        context.strokeStyle = "#b58900";
        context.stroke();
    }
}

function drawTile(x, y, iso_width, iso_height, color, context) {
    context.save();
    // Mapping from tile space to Cartesian coordinates.
    const [cartesianX, cartesianY] = mapToCartesian(x, y, iso_width, iso_height);
    context.translate(cartesianX, cartesianY);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(iso_width / 2, iso_height / 2);
    context.lineTo(0, iso_height);
    context.lineTo(-iso_width / 2, iso_height / 2);
    context.closePath();
    context.fillStyle = color;
    context.fill();

    context.restore();
}

function drawBlock(x, y, z, iso_width, iso_height, context) {
    const top = "#134409";
    const left = "#3A2511";
    const right = "#4A3623";
    context.save();
    // Mapping from tile space to Cartesian coordinates.
    const [cartesianX, cartesianY] = mapToCartesian(x, y, iso_width, iso_height);
    context.translate(cartesianX, cartesianY);

    context.beginPath();
    context.moveTo(0, -z * iso_height);
    context.lineTo(iso_width / 2, iso_height / 2 - z * iso_height);
    context.lineTo(0, iso_height - z * iso_height);
    context.lineTo(-iso_width / 2, iso_height / 2 - z * iso_height);
    context.closePath();
    context.fillStyle = top;
    context.fill();

    context.beginPath();
    context.moveTo(-iso_width / 2, iso_height / 2 - z * iso_height);
    context.lineTo(0, iso_height - z * iso_height);
    context.lineTo(0, iso_height);
    context.lineTo(-iso_width / 2, iso_height / 2);
    context.closePath();
    context.fillStyle = left;
    context.fill();

    // // draw right
    context.beginPath();
    context.moveTo(iso_width / 2, iso_height / 2 - z * iso_height);
    context.lineTo(0, iso_height - z * iso_height);
    context.lineTo(0, iso_height);
    context.lineTo(iso_width / 2, iso_height / 2);
    context.closePath();
    context.fillStyle = right;
    context.fill();

    context.restore();
}

function mapToCartesian(x, y, iso_width, iso_height) {
    const cartesianX = (x - y) * iso_width / 2;
    const cartesianY = (x + y) * iso_height / 2;
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

function zFunk(x,y) {
		return (1/3)*Math.pow(x, 2) + (1/3)*Math.pow(y, 2)
}

function drawBoard(grid,
									 iso_width, iso_height,
									 color, draw_mode, context)
{
    for (let y = 0; y < grid.length; y++)
        for (let x = 0; x < grid[0].length; x++) {
						console.log(zFunk(x,y));
            switch (draw_mode) {
                case 'flat':
                    if (grid[y][x]) drawTile(x, y, iso_width, iso_height, color);
                    break;
                case 'block':
                    if (grid[y][x])
                        drawBlock(x, y, 0.1*zFunk(x-8,y-8)%4, iso_width, iso_height, context);
                    break;
            }
        }
}
