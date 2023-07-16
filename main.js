//think of better way to cut when not allowing diagonals
//dissalow corner cutting
//changable start and finish
//easier drawing walls
//favors diagnoals in some instances (i think it favors them because of the hval of the tile?)
//use different distance func for faster calcs (wouldnt work when i tried to implement it, favored strange routes like before)
//better gui
//make finish and start calculated in map so the size doesnt change the placement relative to the map
//notif when failed
//add comments

testMaps = [
{start: new _vector(0, 0), finish: new _vector(24, 24), height:25,width:25,data:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,true,true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,false,true,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,true,true,false,false,false,false,true,false,false,true,false,false,false,false,true,false,true,true,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,true,false,true,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,true,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,true,false,false,false,false,false,true,false,false]},
]

init = function() {
	ctx.init()
	mouse = new _mouse()
	keyboard = new _keyboard()
	
	SCALE = 25
	ALLOWDIAGONALS = true
	DEBUG = false
	DJ = false//i can spell this word but its a dumber algorithm, just for Proof of concept
	ctx.font = "12px sans-serif"
	GUITEXT = "Click to toggle a wall; Enter to restart the path"
	GUI = {x:SCREENWIDTH-(ctx.measureText(GUITEXT).width+4),y:0,width:ctx.measureText(GUITEXT).width+4,height:15}

	map = new _map(Math.floor(SCREENWIDTH/SCALE),Math.floor(SCREENHEIGHT/SCALE))
	map.randomFill(0.1)

	path = new _path(map)

	loop();
}

class _map {
	constructor(w,h,d, start=new _vector(0,0), finish=new _vector(w-1,h-1)) {
		this.height = h
		this.width = w
		this.start = start
		this.finish = finish
		if (d==undefined) {this.data = new Array(h*w).fill(0)} else {this.data = d}
	}
	randomFill(p) {
		for(var i=0;i<this.data.length;i++) this.data[i] = Math.random()<=p
	}
	valAt(p) {
		return this.data[p.x+(p.y*this.width)]
	}
	hValAt(p) {
		return DJ?0:Math.distance(this.finish,p)
	}
	draw() {
		this.data.forEach(function(a,b) {
			ctx.setColor("white")
			if (a) {
				ctx.fillRect((b%this.width)*SCALE,Math.floor(b/this.width)*SCALE,SCALE,SCALE)
			} else {
				ctx.strokeRect((b%this.width)*SCALE,Math.floor(b/this.width)*SCALE,SCALE,SCALE)
			}
		},this)
	}
}

class _path {
	constructor(m) {
		this.map = m;
		this.openSet = [new _node(m,this,null,this.map.start,0)];
		this.closedSet = [];
		this.finished = false
		this.highlightedNode = null
	}
	step() {
		this.openSet.sort((a,b)=>(a.h+a.g)-(b.h+b.g))
		this.openSet.push(...this.openSet[0].spread())
		this.closedSet.push(...this.openSet.splice(0,1))
		if (this.openSet.length==0 || this.openSet.some(a=>(a.pos.x==this.map.finish.x&&a.pos.y==this.map.finish.y))) this.finished = true
	}
	drawNode(a) {
		var finalPath = a
		ctx.setColor(a.color)
		while (finalPath.parent!=null) {
			ctx.fillRect(finalPath.pos.x*SCALE,finalPath.pos.y*SCALE,SCALE,SCALE)
			finalPath = finalPath.parent
		}
	}
	draw() {
		ctx.setColor("yellow")
		this.openSet.forEach(function(a) {
			ctx.fillRect(a.pos.x*SCALE,a.pos.y*SCALE,SCALE,SCALE)
		},this)
		ctx.setColor("red")
		this.closedSet.forEach(function(a) {
			ctx.fillRect(a.pos.x*SCALE,a.pos.y*SCALE,SCALE,SCALE)
		},this)
		if (this.finished) {
			ctx.setColor("green")
			var finalPath = this.openSet.find(a=>(a.pos.x==this.map.finish.x&&a.pos.y==this.map.finish.y))
			while (finalPath!=null) {
				ctx.fillRect(finalPath.pos.x*SCALE,finalPath.pos.y*SCALE,SCALE,SCALE)
				finalPath = finalPath.parent
			}
		}
		ctx.setColor("orange")
		ctx.fillRect((this.map.finish.x*SCALE)+(SCALE/6),(this.map.finish.y*SCALE)+(SCALE/6),SCALE-(SCALE/3),SCALE-(SCALE/3))
		ctx.setColor("blue")
		ctx.fillRect((this.map.start.x*SCALE)+(SCALE/6),(this.map.start.y*SCALE)+(SCALE/6),SCALE-(SCALE/3),SCALE-(SCALE/3))
		if (this.highlightedNode!=null) this.drawNode(this.highlightedNode)
	}
}

class _node {
	constructor(m,pp,parent,p,g) {
		this.pos = p;
		this.g = g
		//if (!ALLOWDIAGONALS) this.g = Math.distance(pp.start,p)//this wasnt smart. leaving so i think o fa better way to do this
		this.h = m.hValAt(p)
		this.parent = parent;
		this.children = [];
		this.map = m
		this.parentPath = pp
		this.color = "rgba("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+",1)"
	}
	spread() {
		var retSet = [];
		if (this.goodMove(this.pos.add(new _vector(0,1)),this.g+1)) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,1)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,1)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(0,-1)),this.g+1)) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,-1)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,-1)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(1,0)),this.g+1)) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,0)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,0)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(-1,0)),this.g+1)) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,0)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,0)),this.g+1))
		}
		if (ALLOWDIAGONALS) {
			var s2 = Math.sqrt(2)
			if (this.goodMove(this.pos.add(new _vector(1,1)),this.g+s2)) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,1)),this.g+s2))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,1)),this.g+s2))
			}
			if (this.goodMove(this.pos.add(new _vector(1,-1)),this.g+s2)) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,-1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,-1)),this.g+s2))
			}
			if (this.goodMove(this.pos.add(new _vector(-1,1)),this.g+s2)) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,1)),this.g+s2))
			}
			if (this.goodMove(this.pos.add(new _vector(-1,-1)),this.g+s2)) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,-1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,-1)),this.g+s2))
			}
		}
		return retSet
	}
	goodMove(p,g) {
		if (p.x<0||p.y<0||p.x>=this.map.width||p.y>=this.map.height||this.map.valAt(p)) return false
		if (p==null) return true
		var openMatch = this.parentPath.openSet.findIndex(function(a) {return (a.pos.x==p.x&&a.pos.y==p.y)})
		if (openMatch!=-1) {
			if (this.parentPath.openSet[openMatch].g>=g) {
				this.parentPath.openSet.splice(openMatch,1)
				return true;
			} else {
				return false;
			}
		}
		var closedMatch = this.parentPath.closedSet.findIndex(function(a) {return (a.pos.x==p.x&&a.pos.y==p.y)})
		if (closedMatch!=-1) {
			return false
		}
		return true
	}
}

update = function() {
	if (!path.finished) path.step()
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
		if (Math.floor(mouse.callButton(0).clickLoc.x/SCALE)>map.width||Math.floor(mouse.callButton(0).clickLoc.y/SCALE)>map.height) return
		var con = !DEBUG?undefined:path.openSet.find(a=>(a.pos.x==Math.floor(mouse.callButton(0).clickLoc.x/SCALE)&&a.pos.y==Math.floor(mouse.callButton(0).clickLoc.y/SCALE)))
		if (con!=undefined) {
			path.highlightedNode = con
		} else {
			con = !DEBUG?undefined:path.closedSet.find(a=>(a.pos.x==Math.floor(mouse.callButton(0).clickLoc.x/SCALE)&&a.pos.y==Math.floor(mouse.callButton(0).clickLoc.y/SCALE)))
			if (con!=undefined) {
				path.highlightedNode = con
			} else {
				path.highlightedNode = null
				map.data[Math.floor(mouse.callButton(0).clickLoc.x/SCALE)+(Math.floor(mouse.callButton(0).clickLoc.y/SCALE)*map.width)]=!map.data[Math.floor(mouse.callButton(0).clickLoc.x/SCALE)+(Math.floor(mouse.callButton(0).clickLoc.y/SCALE)*map.width)]
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
	path.draw()
	drawGUI()
}

loop = function() {
	requestAnimationFrame(loop)
	update()
	draw()
}

window.onload = init;
