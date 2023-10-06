var EDGE = function(A, B, intensity, option) {
	this.A = A;
	this.B = B;
	this.intensity = intensity;
	this.option = option || {};
}

var EDGES = function(sim) {
	this.list = [];
	this.sim = sim;
	this.update = () => {

	}

	this.draw = () => {
		this.sim.ctx.lineCap = "round";
		this.sim.ctx.lineJoin = 'round';
		for (n in this.list) {
			var edge = this.list[n];
			if (edge.A && edge.B) {
				this.sim.ctx.lineWidth = edge.intensity * edge.option.edgeWidth;
				switch (edge.option.edgeStyle) {
					case "RAINBOW":
						var grad = this.sim.ctx.createLinearGradient(edge.A.x, edge.A.y, edge.B.x, edge.B.y);
						grad.addColorStop(0.1, "rgba(" + edge.A.rgb.r + "," + edge.A.rgb.g + "," + edge.A.rgb.b + "," + edge.intensity + ")");
						grad.addColorStop(0.5, "rgba(" + ((edge.A.rgb.r + edge.B.rgb.r) / 2) + "," + ((edge.A.rgb.g + edge.B.rgb.g) / 2) + "," + ((edge.A.rgb.b + edge.B.rgb.b) / 2) + ",0)");
						grad.addColorStop(0.9, "rgba(" + edge.B.rgb.r + "," + edge.B.rgb.g + "," + edge.B.rgb.b + "," + edge.intensity + ")");
						this.sim.ctx.strokeStyle = grad;
						this.sim.ctx.beginPath();
						this.sim.ctx.moveTo(edge.A.x, edge.A.y);
						this.sim.ctx.lineTo(edge.B.x, edge.B.y);
						this.sim.ctx.stroke();
						break;
					case "SPARKLE":
						var grad = this.sim.ctx.createLinearGradient(edge.A.x, edge.A.y, edge.B.x, edge.B.y);
						grad.addColorStop(0.1, "rgba(255,255,255," + edge.intensity + ")");
						grad.addColorStop(0.3, "rgba(255,255,255,0)");
						grad.addColorStop(0.7, "rgba(255,255,255,0)");
						grad.addColorStop(0.9, "rgba(255,255,255," + edge.intensity + ")");
						this.sim.ctx.strokeStyle = grad;
						this.sim.ctx.beginPath();
						this.sim.ctx.moveTo(edge.A.x, edge.A.y);
						this.sim.ctx.lineTo(edge.B.x, edge.B.y);
						this.sim.ctx.stroke();
						break;
					default:
						this.sim.ctx.strokeStyle = "rgba(255,255,255," + edge.intensity + ")";
						this.sim.ctx.beginPath();
						this.sim.ctx.moveTo(edge.A.x, edge.A.y);
						this.sim.ctx.lineTo(edge.B.x, edge.B.y);
						this.sim.ctx.stroke();

				}
				this.sim.ctx.strokeStyle = "rgba(255,255,255, 1)";
			}
		}

		this.sim.ctx.setLineDash([])
		this.sim.ctx.lineWidth = 1;
	}

	this.add = (A, B, intensity, options) => {

		var exists = this.list.find(e => ((e.A.id == A.id && e.B.id == B.id) || (e.A.id == B.id && e.B.id == A.id)));
		if (!exists)
			this.list.push(new EDGE(A, B, intensity, options));
		//else
		//console.log("Exists");
	}

	this.clear = () => {
		this.list = [];
	}

	return this;
}
