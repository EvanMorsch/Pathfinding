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