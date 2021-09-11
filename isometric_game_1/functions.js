//////////////////////////////////////////////////////////////////////////////////////
/*
	FUNCTION IMPLEMENTATIONS
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

function drawBoard(grid,
									 iso_width, iso_height,
									 color, draw_mode, context)
{
    for (let y = 0; y < grid.length; y++)
        for (let x = 0; x < grid[0].length; x++) {
            switch (draw_mode) {
                case 'flat':
                    if (grid[y][x]) drawTile(x, y, iso_width, iso_height, color);
                    break;
                case 'block':
                    if (grid[y][x])
                        drawBlock(x, y, Math.random() * 4, iso_width, iso_height, context);
                    break;
            }
        }
}

module.exports = {
		drawBoard,
		createBoardGrid,
		mapToCartesian,
		drawBlock,
		drawTile,
		drawGraphLines,
};
