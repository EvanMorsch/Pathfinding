class _path {
	constructor(m) {
		this.map = m;
		this.openSet = [new _node(m,this,null,this.map.start,0)];
		this.closedSet = [];
		this.finished = false
		this.stuck = false
		this.highlightedNode = null
        this.dijkstra = false
	}
    hValAt(p) {
		return this.dijkstra?0:Math.distance(this.map.finish,p)
	}
	step() {
		this.openSet.sort((a,b)=>(a.h+a.g)-(b.h+b.g))
		this.openSet.push(...this.openSet[0].spread())
		this.closedSet.push(...this.openSet.splice(0,1))
		if (this.openSet.some(a=>(a.pos.x==this.map.finish.x&&a.pos.y==this.map.finish.y))) this.finished = true
		if (!this.finished && this.openSet.length==0) this.stuck = true
	}
}