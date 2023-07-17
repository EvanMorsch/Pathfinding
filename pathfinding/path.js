class _path {
	constructor(m) {
		this.map = m;
		this.openSet = [new _node(m,this,null,this.map.start,0)];
		this.closedSet = [];
		this.finished = false
		this.stuck = false
		this.highlightedNode = null
	}
	step() {
		this.openSet.sort((a,b)=>(a.h+a.g)-(b.h+b.g))
		this.openSet.push(...this.openSet[0].spread())
		this.closedSet.push(...this.openSet.splice(0,1))
		if (this.openSet.some(a=>(a.pos.x==this.map.finish.x&&a.pos.y==this.map.finish.y))) this.finished = true
		if (!this.finished && this.openSet.length==0) this.stuck = true
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