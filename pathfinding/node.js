///Node shouldnt talkto map

class _node {
	constructor(m,pp,parent,p,g) {
		this.pos = p;
		this.g = g
		this.h = pp.hValAt(p)
		this.parent = parent;
		this.map = m
		this.parentPath = pp
		this.color = "rgba("+(Math.random()*255)+","+(Math.random()*255)+","+(Math.random()*255)+",1)"
	}
	spread() {
		var retSet = [];
		let moveSet = [
			{pos:new _vector(0,1), g_cost:this.g+1},
			{pos:new _vector(0,-1), g_cost:this.g+1},
			{pos:new _vector(1,0), g_cost:this.g+1},
			{pos:new _vector(-1,0), g_cost:this.g+1}
		]
		if (ALLOWDIAGONALS) {
			let s2 = Math.sqrt(2)
			moveSet.push(
				{pos:new _vector(1,1), g_cost:this.g+s2},
				{pos:new _vector(1,-1), g_cost:this.g+s2},
				{pos:new _vector(-1,1), g_cost:this.g+s2},
				{pos:new _vector(-1,-1), g_cost:this.g+s2}
			)
		}

		moveSet.forEach(
			a=>{
				if (this.goodMove(this.pos.add(a.pos),a.g_cost)) {
					retSet.push(new _node(this.map,this.parentPath,this,this.pos.add(a.pos),a.g_cost))
				}
			}, this
		)
		
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