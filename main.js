//think of better way to cut when not allowing diagonals
//dissalow corner cutting
//changable start and finish
//easier drawing walls
//better gui
//make finish and start calculated in map so the size doesnt change the placement relative to the map
//notif when failed
//add comments
//move click responsibility to map

testMaps = [
	{
		start: new _vector(0, 0), 
		finish: new _vector(24, 24), 
		height:25,
		width:25,
		data:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,false,false,false,false,true,false,false,true,false,false,false,false,true,false,true,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,true,false,false]},
]

init = function() {
	ctx.init()
	mouse = new _mouse()
	keyboard = new _keyboard()
	
	DEBUG = false
	ctx.font = "12px sans-serif"
	GUITEXT = "Click to toggle a wall; Enter to restart the path"
	GUI = {x:SCREENWIDTH-(ctx.measureText(GUITEXT).width+4), y:0, width:ctx.measureText(GUITEXT).width+4, height:15}

	map = new _map(Math.floor(SCREENWIDTH/MAP_DEFAULT_SCALE), Math.floor(SCREENHEIGHT/MAP_DEFAULT_SCALE))
	map.start = new _vector(0,0)
	map.finish = new _vector(map.width-1, map.height-1)
	map.randomFill(0.1)

	path = new _path(map)

	loop();
}

update = function() {
	if (!path.finished && !path.stuck) {
		if (!DEBUG || keyboard.callKey(" ").poll()) path.step()
	}
	if (keyboard.callKey("1").poll()) {
		map = new _map(testMaps[0].width,testMaps[0].height,testMaps[0].data, testMaps[0].start, testMaps[0].finish)
		path = new _path(map)
	}
	if (keyboard.callKey("enter").poll()) {
		path = new _path(map)
	}
	if (keyboard.callKey("d").poll()) {
		DEBUG = !DEBUG
	}
	
	if (mouse.callButton(0).poll()) {
		if (Math.floor(mouse.callButton(0).clickLoc.x/map.scale)>map.width||Math.floor(mouse.callButton(0).clickLoc.y/map.scale)>map.height) return
		var con = !DEBUG?undefined:path.openSet.find(a=>(a.pos.x==Math.floor(mouse.callButton(0).clickLoc.x/map.scale)&&a.pos.y==Math.floor(mouse.callButton(0).clickLoc.y/map.scale)))
		if (con!=undefined) {
			path.highlightedNode = con
		} else {
			con = !DEBUG?undefined:path.closedSet.find(a=>(a.pos.x==Math.floor(mouse.callButton(0).clickLoc.x/map.scale)&&a.pos.y==Math.floor(mouse.callButton(0).clickLoc.y/map.scale)))
			if (con!=undefined) {
				path.highlightedNode = con
			} else {
				path.highlightedNode = null
				map.data[
					Math.floor(mouse.callButton(0).clickLoc.x/map.scale)+(Math.floor(mouse.callButton(0).clickLoc.y/map.scale)*map.width)
				] = !map.data[
					Math.floor(mouse.callButton(0).clickLoc.x/map.scale)+(Math.floor(mouse.callButton(0).clickLoc.y/map.scale)*map.width)
				]
				path = new _path(map)
			}
		}
	}
}

drawGUI = function() {
	if (!(mouse.location.x>=GUI.x&&mouse.location.x<=GUI.x+GUI.width&&mouse.location.y>=GUI.y&&mouse.location.y<=GUI.y+GUI.height)) {
		ctx.clearRect(GUI.x,GUI.y,GUI.width,GUI.height)
		ctx.setColor("white")
		ctx.strokeRect(GUI.x,GUI.y,GUI.width,GUI.height)
		ctx.fillText(GUITEXT,GUI.x+2,GUI.y+GUI.height-2)
	}
}

draw = function() {
	ctx.clearScreen()
	map.draw()
	map.drawPath(path)
	drawGUI()
}

loop = function() {
	requestAnimationFrame(loop)
	update()
	draw()
}

window.onload = init;
