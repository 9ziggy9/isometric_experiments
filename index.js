window.onload = function () {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		const width = canvas.width = 0.75 * window.innerWidth;
		const height = canvas.height = 0.75 * window.innerHeight;
		const TILE_WIDTH = 100;
		const TILE_HEIGHT = 50;

		context.translate(width / 2, 50);
		drawTile(0, 0, "green");
		drawTile(1, 0, "blue");
		drawTile(2, 0, "red");
		drawTile(0, 1, "orange");
		drawTile(0, 2, "purple");

		function drawTile(x, y, color) {
				context.save();

				// Mapping from tile space to Cartesian coordinates.
				const [cartesianX, cartesianY] = mapToCartesian(x, y);
				context.translate(cartesianX, cartesianY);

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
}
