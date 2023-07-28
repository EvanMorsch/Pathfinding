//color scaler function (b-w scale)
//poly line array drawing function
//update to class based?..

var c = document.getElementById("Canvas");//create global ctx object
ctx = c.getContext("2d");

ctx.init = function() {
	ctx.canvas.width = window.innerWidth;//set canvas size
	ctx.canvas.height = window.innerHeight;
	SCREENWIDTH = window.innerWidth;//create size global
	SCREENHEIGHT = window.innerHeight;
}
ctx.clearScreen = function() {//clears entire screen
	ctx.clearRect(0,0,SCREENWIDTH,SCREENHEIGHT);
}
ctx.setColor = function(col) {//sets all drawing functions to given color
	ctx.strokeStyle = col
	ctx.fillStyle = col
}
