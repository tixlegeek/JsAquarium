var robotIds = 0;
var SENSOR_FUNC = {
	BUMP: function() {

		var collide = false;
		if ((this.x <= 0) || (this.x >= this.sim.width) || (this.y <= 0) || (this.y >= this.sim.height)) {
			return true;
		}

		for (n in this.robot.neighbors) {
			var neighbor = this.robot.neighbors[n].n;
			var d = Math.hypot((this.x - neighbor.x), (this.y - neighbor.y));
			if (d < (this.d + neighbor.d)) {
				collide = true;
			}
		}
		return collide;
	}
}
var SENSOR = function(sim, robot, args) {
	this.sim = sim;
	this.robot = robot;
	this.x = 0;
	this.y = 0;
	this.a = args.a || 0;
	this.d = args.d || 0;
	this.r = args.r || 5;
	this.activated = false;
	this.cb = args.cb || function() {};

	this.draw = () => {
		this.sim.ctx.strokeStyle = "#fff";
		if (this.activated == true) {
			this.sim.ctx.fillStyle = "#f00";
		} else {
			this.sim.ctx.fillStyle = "#200";
		}

		this.sim.ctx.beginPath();
		this.sim.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, 0);
		this.sim.ctx.fill();
		this.sim.ctx.stroke();
	}

	this.update = () => {
		this.x = this.robot.x + Math.sin(this.robot.a + this.a) * (this.d + this.robot.d);
		this.y = this.robot.y + Math.cos(this.robot.a + this.a) * (this.d + this.robot.d);
		this.activated = this.cb.call(this);
	}
	return this;
}
var ROBOT = function(sim, args) {
	this.sim = sim;
	this.id = ++robotIds;
	this.sex = (Math.random() * 10 > 5) ? "f" : "m";
	this.d = args.d || 10;
	this.x = args.x || 0;
	this.y = args.y || 0;
	this.dx = 0;
	this.dy = 0;
	this.a = args.a || 0;
	this.na = 0;
	this.v = args.v || 1;
	this.color = args.color || 0;
	this.rgb = {
		r: 0,
		g: 0,
		b: 0
	};
	this.vision = args.vision || 40;
	this.sensors = {};
	this.neighbors = [];
	this.hasNeighbors = false;
	this.t = 0;
	this.tail = [];
	this.tailLength = args.tailSkipTrace || 10;
	this.tailSkipTrace = args.tailSkipTrace || 5;
	this.option = args.option || {
		nominalGitter: 0.5,
		showVision: false,
		showEdges: false,
		showTail: true,
		robotShape: "CIRCLE",
		showRobot: false,
		fillRobot: false,
		showSensors: false,
		showInfos: false,
		edgeOptions: {

		}
	};
	this.getNeighbors = () => {
		var neighbors = [];
		this.hasNeighbors = false;
		for (n in this.sim.robots) {
			neighbor = this.sim.robots[n];
			if (neighbor.id != this.id) {
				if ((Math.abs(this.x - neighbor.x) < (this.vision + this.d)) && (Math.abs(this.y - neighbor.y) < (this.vision + this.d)) && (neighbors.length < 5)) {
					var d = Math.hypot((this.x - neighbor.x), (this.y - neighbor.y)) - this.d
					if (d <= (this.vision + this.d)) {
						neighbors.push({
							d: d,
							n: neighbor,
							i: ((this.vision + this.d)) / (this.vision + this.d)
						});
						if (this.option.showEdges)
							this.sim.edges.add(this, neighbor, ((this.vision + this.d) - d) / (this.vision + this.d), this.option.edgeOptions || {});
						this.hasNeighbors = true;
					}
				}
			}
		}
		return neighbors;
	}
	this.createSensor = (name, args) => {
		var s = new SENSOR(this.sim, this, args);
		this.sensors[name] = s;
		return s;
	}
	this.drawSensors = () => {
		for (s in this.sensors) {
			this.sensors[s].draw();
		}
	}
	this.updateSensors = () => {
		for (s in this.sensors) {
			this.sensors[s].update();
		}
	}

	this.traceTail = () => {

		if (!(this.t % this.tailSkipTrace)) {
			if (this.tail.length > this.tailLength)
				this.tail.pop();
			this.tail.unshift({
				x: this.x | 0,
				y: this.y | 0
			});
		}
	}

	this.draw = () => {
		var arrowLength = 30;
		this.sim.ctx.strokeStyle = palette[this.color];
		this.sim.ctx.fillStyle = palette[this.color];

		if (this.option.showRobot) {
			switch (this.option.robotShape) {

				case "TRIANGLE":
					TRIANGLE.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				case "SQUARE":
					SQUARE.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				case "PENTAGON":
					PENTAGON.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				case "HEXAGON":
					HEXAGON.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				case "HEPTAGON":
					HEPTAGON.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				case "OCTOGON":
					OCTOGON.draw(this.sim.ctx, this.x, this.y, this.d);
					break;
				default:
					this.sim.ctx.beginPath();
					this.sim.ctx.arc(this.x, this.y, this.d, 0, 2 * Math.PI, 0);
					break;
			}
			this.sim.ctx.stroke();
			if (this.option.fillRobot) {
				this.sim.ctx.fill();
			}
		}

		if (this.option.showVision == true) {
			if (this.hasNeighbors) {
				this.sim.ctx.strokeStyle = "#888";
				this.sim.ctx.fillStyle = "#fff";
				this.sim.ctx.font = '20px mono';
				this.sim.ctx.fillText(this.neighbors.length, this.x + 20 + this.d, this.y + 20 + this.d);
			} else {
				this.sim.ctx.strokeStyle = "#444";
			}
			this.sim.ctx.setLineDash([3, 6]);
			this.sim.ctx.beginPath();
			this.sim.ctx.lineDashOffset = this.sim.t;
			this.sim.ctx.arc(this.x, this.y, (this.vision + this.d), 0, 2 * Math.PI, 0);
			this.sim.ctx.stroke();
			this.sim.ctx.setLineDash([]);

		}
		if (this.hasNeighbors) {

		}
		if (this.option.showTail) {
			this.sim.ctx.lineWidth = 1;
			this.sim.ctx.setLineDash([]);
			this.sim.ctx.lineJoin = 'round';
			this.sim.ctx.lineCap = "round";
			var ax = this.x;
			var ay = this.y
			for (t in this.tail) {
				this.sim.ctx.beginPath();
				//this.sim.ctx.arc(ax, ay, ((this.trace.length-t)/this.trace.length)*2.5, 0, 2 * Math.PI, 0);
				this.sim.ctx.strokeStyle = palette[this.color];
				//this.sim.ctx.strokeStyle = "rgba("+this.rgb.r+","+this.rgb.g+","+this.rgb.b+","+ ((this.tail.length - t) / this.tail.length)+")"
				this.sim.ctx.lineWidth = ((this.tail.length - t) / this.tail.length) * 3;
				this.sim.ctx.moveTo(ax, ay);
				this.sim.ctx.lineTo(this.tail[t].x, this.tail[t].y);
				this.sim.ctx.stroke();
				ax = this.tail[t].x;
				ay = this.tail[t].y;
			}
			this.sim.ctx.setLineDash([]);
			this.sim.ctx.lineWidth = 1;
		}
		if (this.option.showSensors) {
			this.drawSensors();
			this.sim.ctx.strokeStyle = "#fff";
			this.sim.ctx.beginPath();
			canvas_arrow(this.sim.ctx, this.x, this.y, this.x + (this.dx * 20), this.y + (this.dy * 20))
			this.sim.ctx.stroke();
			//this.sim.ctx.fillStyle = "#fa8";
		}
		if (this.option.showInfos) {
			this.sim.ctx.font = '10px mono';
			this.sim.ctx.fillText("n°" + this.id + " N:" + this.neighbors.length, this.x + 20, this.y + 20);
		}
		//	this.sim.ctx.fillText(JSON.stringify(this.trace), this.x + 20, this.y + 40);
	}

	this.update = () => {
		this.t++;
		this.color++;
		this.color = this.color % palette.length;
		this.rgb = hexToRgb(palette[this.color]);
		this.updateSensors();
		this.neighbors = this.getNeighbors();
		if (this.hasNeighbors) {

		}
		if ((this.sensors["left"].activated == true) && (this.sensors["left"].activated == true)) {
			this.a += Math.PI;
		} else if (this.sensors["left"].activated == true) {
			this.a += 1 + Math.random() * 0.050 - 0.025;
		} else if (this.sensors["right"].activated == true) {
			this.a -= 1 + Math.random() * 0.050 - 0.025;
		}
		this.a += Math.random() * this.option.nominalGitter - (this.option.nominalGitter / 2);

		this.dx = Math.sin(this.a);
		this.dy = Math.cos(this.a);

		var vdx = (this.dx * this.v);
		var vdy = (this.dy * this.v);

		if (((this.x + vdx) <= this.sim.width) && ((this.x + vdx) > 0))
			this.x += vdx;
		else
			this.x -= vdx;
		if (((this.y + vdy) <= this.sim.height) && ((this.y + vdy) > 0))
			this.y += vdy;
		else
			this.y -= vdy;
		this.traceTail();
	}
	this.createSensor("right", {
		a: 0.8,
		d: 0,
		r: 5,
		cb: SENSOR_FUNC.BUMP

	});
	this.createSensor("left", {
		a: -0.8,
		d: 0,
		r: 5,
		cb: SENSOR_FUNC.BUMP

	});
	return this;
}
