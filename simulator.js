var SHAPES = ["TRIANGLE", "SQUARE", "PENTAGON", "HEXAGON", "CIRCLE", "HEPTAGON", "OCTOGON"];
var EDGESTYLES = ["RAINBOW", "SPARKLE", "DEFAULT"];

/*
	Simulation
*/
var SIMULATOR = function() {
	this.canvas = document.createElement('CANVAS');
	this.ctx = this.canvas.getContext('2d');

	this.ctx.lineWidth = 1;
	this.ctx.lineCap = "round";
	this.ctx.lineJoin = 'round';
	this.ctx.lineDashOffset = 0;
	this.mouse = {
		ax: 0,
		ay: 0,
		a: 0,
		f: 0,
		force: 200
	}
	document.body.appendChild(this.canvas);
	// Create an edge list
	this.edges = new EDGES(this);
	this.robots = [];
	this.t = 0;
	this.width = 0;
	this.height = 0;

	this.createRobot = (args) => {
		var robot = new ROBOT(this, args);
		this.robots.push(robot);
	}

	this.updateRobots = () => {
		for (r in this.robots) {
			this.robots[r].update();
		}
	}

	this.drawRobots = () => {
		for (r in this.robots) {
			this.robots[r].draw();
		}
	}

	this.update = () => {
		this.t++;
		this.edges.clear();
		this.edges.update();
		if (!(this.t % 2)) {
			var OPT = OPTIONS[Math.random() * OPTIONS.length | 0];
			//this.robots[Math.random()*this.robots.length|0].option = OPT;
			/*for (r in this.robots)
			{
		}*/
		}
		this.updateRobots();
		this.draw();
	}

	this.draw = () => {
		this.clean();
		this.edges.draw();
		this.drawRobots();
	}

	this.clean = () => {
		this.ctx.fillStyle = '#20282a';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	this.resize = () => {
		this.canvas.height = this.height = window.innerHeight;
		this.canvas.width = this.width = window.innerWidth;
		for (r in this.robots) {
			if (this.robots[r].x > this.width)
				this.robots[r].x = this.width
			if (this.robots[r].y > this.height)
				this.robots[r].y = this.height
		}
		this.clean();
	}
	/*
		Makes robot kinda move toward a moving mouse.
	*/
	this.mousemove = (e) => {
		var x = e.pageX;
		var y = e.pageY;
		for (r in this.robots) {
			var robot = this.robots[r];
			var d = Math.hypot((x - robot.x), (y - robot.y))
			if (d <= (this.mouse.force)) {
				var a = Math.atan2(x - robot.x, y - robot.y);
				robot.a = a; //+= Math.atan2(Math.sin(robot.a-a-Math.PI), Math.cos(robot.a-a-Math.PI))/2
			}

		}
		this.mouse.ax = x;
		this.mouse.ay = y;
	}

	this.resize();
}


var simulator = new SIMULATOR();
addEventListener('resize', (e) => {
	simulator.resize();
});

addEventListener('mousemove', (e) => {
	simulator.mousemove(e);
});

/*
	Main loop
*/
var step = () => {
	simulator.update();
	requestAnimationFrame(step)
};
requestAnimationFrame(step)

/*
	Chose an option set and pass it to robot creation loop below
*/
var OPTION_MULTI = function() {
	return {
		x: Math.random() * simulator.canvas.width | 0,
		y: Math.random() * simulator.canvas.height | 0,
		d: Math.random() * 5 + 5 | 0,
		a: Math.random() * (2 * Math.PI),
		v: Math.random() * 1 + 0.5,
		tailSkipTrace: 10,
		tailLength: Math.random() * 3 | 0,
		color: (Math.random() * palette.length) | 0,
		vision: 100, //Math.random()*10 + 50 | 0,
		option: {
			nominalGitter: Math.random(),
			showVision: false, //(Math.random()*2>1),
			showTail: (Math.random() * 10 < 2),
			showRobot: (Math.random() * 2 > 1),
			robotShape: SHAPES[Math.random() * SHAPES.length | 0],
			fillRobot: (Math.random() * 2 > 1),
			showSensors: false, //(Math.random()*2>1),
			showInfos: false,
			showEdges: (Math.random() * 3 > 2),
			edgeOptions: {
				edgeStyle: EDGESTYLES[Math.random() * EDGESTYLES.length | 0],
				edgeWidth: 10
			}
		}
	};
}

var OPTION_STEM = function() {
	return {
		x: Math.random() * simulator.canvas.width | 0,
		y: Math.random() * simulator.canvas.height | 0,
		d: Math.random() * 5 + 5 | 0,
		a: Math.random() * (2 * Math.PI),
		v: Math.random() * 1 + 0.5,
		tailSkipTrace: 10,
		tailLength: Math.random() * 3 | 0,
		color: (Math.random() * palette.length) | 0,
		vision: 100, //Math.random()*10 + 50 | 0,
		option: {
			nominalGitter: 0.5 + Math.random() / 2,
			showVision: false, //(Math.random()*2>1),
			showTail: false,
			showRobot: true,
			robotShape: SHAPES[Math.random() * SHAPES.length | 0],
			fillRobot: (Math.random() * 2 > 1),
			showSensors: false, //(Math.random()*2>1),
			showInfos: false,
			showEdges: (Math.random() * 3 > 2),
			edgeOptions: {
				edgeStyle: "DEFAULT",
				edgeWidth: 10
			}
		}
	};
}

var OPTION_DEBUG = function() {
	return {
		x: Math.random() * simulator.canvas.width | 0,
		y: Math.random() * simulator.canvas.height | 0,
		d: Math.random() * 5 + 5 | 0,
		a: Math.random() * (2 * Math.PI),
		v: Math.random() * 1 + 0.5,
		tailSkipTrace: 10,
		tailLength: Math.random() * 3 | 0,
		color: (Math.random() * palette.length) | 0,
		vision: 100, //Math.random()*10 + 50 | 0,
		option: {
			nominalGitter: Math.random() / 4,
			showVision: true, //(Math.random()*2>1),
			showTail: false,
			showRobot: true,
			robotShape: SHAPES[Math.random() * SHAPES.length | 0],
			fillRobot: false, //(Math.random()*2>1),
			showSensors: true, //(Math.random()*2>1),
			showInfos: true,
			showEdges: (Math.random() * 3 > 2),
			edgeOptions: {
				edgeStyle: EDGESTYLES[Math.random() * EDGESTYLES.length | 0],
				edgeWidth: 10
			}
		}
	};
}

var OPTION_GON = function() {
	return {
		x: Math.random() * simulator.canvas.width | 0,
		y: Math.random() * simulator.canvas.height | 0,
		d: Math.random() * 5 + 5 | 0,
		a: Math.random() * (2 * Math.PI),
		v: Math.random() * 1 + 0.5,
		tailSkipTrace: 10,
		tailLength: Math.random() * 3 | 0,
		color: (Math.random() * palette.length) | 0,
		vision: 100, //Math.random()*10 + 50 | 0,
		option: {
			nominalGitter: Math.random() / 2,
			showVision: false, //(Math.random()*2>1),
			showTail: true,
			showRobot: true,
			robotShape: SHAPES[Math.random() * SHAPES.length | 0],
			fillRobot: false, //(Math.random()*2>1),
			showSensors: false, //(Math.random()*2>1),
			showInfos: false,
			showEdges: (Math.random() * 3 > 2),
			edgeOptions: {
				edgeStyle: "DEFAULT",
				edgeWidth: 10
			}
		}
	};
}
var OPTIONS = [OPTION_MULTI(), OPTION_STEM(), OPTION_DEBUG(), OPTION_GON()];

// Create 100 robots.
for (i = 0; i < 100; i++) {
	simulator.createRobot(
		OPTION_STEM()
	);
}
