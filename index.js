window.onload = function () {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		const width = canvas.width = 0.75*window.innerWidth;
		const height = canvas.height = 0.75*window.innerHeight;
		const TILE_WIDTH = 100;
		const TILE_HEIGHT = 50;

		context.translate(width / 2, 50);
		drawTile(0, 0, "green");

		function drawTile(x, y, color) {
				context.save();
				context.translate(x,y);

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
}
