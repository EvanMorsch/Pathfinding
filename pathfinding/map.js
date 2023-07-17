const MAP_SCALE = 25

class _map {
	constructor(w,h,d, start=new _vector(0,0), finish=new _vector(w-1,h-1)) {
		this.height = h
		this.width = w
		this.start = start
		this.finish = finish
        this.scale = MAP_SCALE
		if (d==undefined) {this.data = new Array(h*w).fill(0)} else {this.data = d}
	}
	randomFill(p) {
		for(var i=0;i<this.data.length;i++) this.data[i] = Math.random()<=p
	}
	valAt(p) {
		return this.data[p.x+(p.y*this.width)]
	}
	draw() {
		this.data.forEach(function(a,b) {
			ctx.setColor("white")
			if (a) {
				ctx.fillRect((b%this.width)*this.scale,Math.floor(b/this.width)*this.scale,this.scale,this.scale)
			} else {
				ctx.strokeRect((b%this.width)*this.scale,Math.floor(b/this.width)*this.scale,this.scale,this.scale)
			}
		},this)
	}
    drawNode(n) {
		ctx.setColor(n.color)
		while (n.parent!=null) {
			ctx.fillRect(n.pos.x*this.scale,n.pos.y*this.scale,this.scale,this.scale)
			n = n.parent
		}
	}
    drawPath(p) {
		ctx.setColor("yellow")
		p.openSet.forEach(function(a) {
			ctx.fillRect(a.pos.x*this.scale,a.pos.y*this.scale,this.scale,this.scale)
		},this)
		ctx.setColor("red")
		p.closedSet.forEach(function(a) {
			ctx.fillRect(a.pos.x*this.scale,a.pos.y*this.scale,this.scale,this.scale)
		},this)
		if (p.finished) {
			ctx.setColor("green")
			var finalPath = p.openSet.find(a=>(a.pos.x==p.map.finish.x&&a.pos.y==p.map.finish.y))
			while (finalPath!=null) {
				ctx.fillRect(finalPath.pos.x*this.scale,finalPath.pos.y*this.scale,this.scale,this.scale)
				finalPath = finalPath.parent
			}
		}
		ctx.setColor("orange")
		ctx.fillRect((p.map.finish.x*this.scale)+(this.scale/6),(p.map.finish.y*this.scale)+(this.scale/6),this.scale-(this.scale/3),this.scale-(this.scale/3))
		ctx.setColor("blue")
		ctx.fillRect((p.map.start.x*this.scale)+(this.scale/6),(p.map.start.y*this.scale)+(this.scale/6),this.scale-(this.scale/3),this.scale-(this.scale/3))
		if (p.highlightedNode!=null) this.drawNode(p.highlightedNode)
	}
}