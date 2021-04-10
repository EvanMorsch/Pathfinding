//think of better way to cut when not allowing diagonals
//changable start and finish
//easier drawing walls
//enter to start path

init = function() {
	ctx.init()
	mouse = new _mouse()
	
	SCALE = 25
	ALLOWDIAGONALS = false

	map = new _map(25,25)
	map.randomFill(0.1)
	
	start = new _vector(0,0)
	finish = new _vector(map.width-1,map.height-1)
	path = new _path(map,start,finish)

	loop();
}

class _map {
	constructor(w,h) {
		this.height = h;
		this.width = w;
		this.data = new Array(h*w).fill(0);
	}
	randomFill(p) {
		for(var i=0;i<this.data.length;i++) this.data[i] = Math.random()<=p
	}
	valAt(p) {
		return this.data[p.x+(p.y*this.width)]
	}
	hValAt(p) {
		return Math.distance(finish,p)
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
	constructor(m,s,f) {
		this.map = m;
		this.start = s;
		this.finish = f;
		this.openSet = [new _node(m,this,null,s,0)];
		this.closedSet = [];
		this.finished = false
	}
	step() {
		this.openSet.sort((a,b)=>(a.h+a.g)-(b.h+b.g))
		this.openSet.push(...this.openSet[0].spread())
		this.closedSet.push(...this.openSet.splice(0,1))
		if (this.openSet.some(a=>(a.pos.x==finish.x&&a.pos.y==finish.y))) this.finished = true
		//console.log(this)
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
			var finalPath = this.openSet.find(a=>(a.pos.x==finish.x&&a.pos.y==finish.y))
			while (finalPath.parent!=null) {
				ctx.fillRect(finalPath.pos.x*SCALE,finalPath.pos.y*SCALE,SCALE,SCALE)
				finalPath = finalPath.parent
			}
		}
	}
}

class _node {
	constructor(m,pp,parent,p,g) {
		this.pos = p;
		this.g = g
		//if (!ALLOWDIAGONALS) this.g = Math.distance(pp.start,p)//this wasnt smart. leaving so i think o fa better way to do this
		//console.log(m)
		this.h = m.hValAt(p)
		this.parent = parent;
		this.children = [];
		this.map = m
		this.parentPath = pp
	}
	spread() {
		var retSet = [];
		if (this.goodMove(this.pos.add(new _vector(0,1)))) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,1)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,1)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(0,-1)))) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,-1)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(0,-1)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(1,0)))) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,0)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,0)),this.g+1))
		}
		if (this.goodMove(this.pos.add(new _vector(-1,0)))) {
			retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,0)),this.g+1))
			this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,0)),this.g+1))
		}
		if (ALLOWDIAGONALS) {
			if (this.goodMove(this.pos.add(new _vector(1,1)))) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,1)),this.g+1))
			}
			if (this.goodMove(this.pos.add(new _vector(1,-1)))) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,-1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(1,-1)),this.g+1))
			}
			if (this.goodMove(this.pos.add(new _vector(-1,1)))) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,1)),this.g+1))
			}
			if (this.goodMove(this.pos.add(new _vector(-1,-1)))) {
				retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,-1)),this.g+1))
				this.children.push(new _node(this.map,this.parentPath,this,this.pos.add(new _vector(-1,-1)),this.g+1))
			}
		}
		//console.log(retSet)
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
	
	if (mouse.callButton(0).poll()) {
		console.log(Math.floor(mouse.callButton(0).clickLoc.x/SCALE),Math.floor(mouse.callButton(0).clickLoc.y/SCALE))
		map.data[Math.floor(mouse.callButton(0).clickLoc.x/SCALE)+(Math.floor(mouse.callButton(0).clickLoc.y/SCALE)*map.width)]=!map.data[Math.floor(mouse.callButton(0).clickLoc.x/SCALE)+(Math.floor(mouse.callButton(0).clickLoc.y/SCALE)*map.width)]
		path = new _path(map,start,finish)
	}
}

draw = function() {
	ctx.clearScreen()
	map.draw()
	path.draw()
}

loop = function() {
	requestAnimationFrame(loop)
	update()
	draw()
}

window.onload = init;
