const PATH_HEURISTIC = {
    DIJSTRA:Symbol("DIJSTRA"),
    ASTAR:Symbol("ASTAR"),
    MANHATTAN:Symbol("MANHATTAN")
}

class _path {
	constructor(m) {
		this.map = m;
		this.openSet = [new _node(m,this,null,this.map.start,0)];
		this.closedSet = [];
		this.finished = false
		this.stuck = false
		this.highlightedNode = null
        this.heuristic = PATH_HEURISTIC.ASTAR
	}
    hValAt(p) {
        let retVal = 0
        switch (this.heuristic)
        {
            case PATH_HEURISTIC.ASTAR:
                retVal = Math.distance(this.map.finish, p)
                break
            case PATH_HEURISTIC.MANHATTAN:
                retVal = (this.map.finish.x-p.x)+(this.map.finish.y-p.y)
                break
            case PATH_HEURISTIC.DIJSTRA:
            default:
                retVal = 0
                break
        }
		return retVal
	}
	step() {
		this.openSet.sort((a,b)=>(a.h+a.g)-(b.h+b.g))
		this.openSet.push(...this.openSet[0].spread())
		this.closedSet.push(...this.openSet.splice(0,1))
		if (this.openSet.some(a=>(a.pos.x==this.map.finish.x&&a.pos.y==this.map.finish.y))) this.finished = true
		if (!this.finished && this.openSet.length==0) this.stuck = true
	}
}