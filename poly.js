POLY = function(corners){
  this.corners = corners || 3;
  this.a = 2*Math.PI/corners;
  this.as = [];

  for(i=0; i<corners; i++){
    var angle = this.a * i;
    this.as.push({dx: Math.sin(angle+Math.PI/corners), dy: Math.cos(angle+Math.PI/corners)});
  }

  this.draw = (ctx, x, y, d)=>{
    ctx.beginPath();
    ctx.moveTo(x + (this.as[0].dx*d), y + (this.as[0].dy*d));
    for(var c=1; c<this.as.length; c++){
      ctx.lineTo(x + (this.as[c].dx*d), y + (this.as[c].dy*d));
    }
    ctx.lineTo(x + (this.as[0].dx*d), y + (this.as[0].dy*d));
  }
}

var TRIANGLE = new POLY(3);
var SQUARE = new POLY(4);
var PENTAGON = new POLY(5);
var HEXAGON = new POLY(6);
var HEPTAGON = new POLY(7);
var OCTOGON = new POLY(8);
