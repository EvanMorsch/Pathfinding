Math.distance = function(a,b) {
	return Math.sqrt(((a.x-b.x)*(a.x-b.x))+((a.y-b.y)*(a.y-b.y)))
}

class _vector {
	constructor (x,y) {
		this.x = x;
		this.y = y;
	}
	add(a) {
		return new _vector(this.x+a.x,this.y+a.y,this.z+a.z);
	}
	subtract(a) {
		return new _vector(this.x-a.x,this.y-a.y,this.z-a.z);
	}
}
