window.onload = function () {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		const width = canvas.width = 0.75*window.innerWidth;
		const height = canvas.height = 0.75*window.innerHeight;

		context.fillStyle = 'green';
		context.fillRect(0,0,width,height);
}
