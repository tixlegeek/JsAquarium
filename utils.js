
function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10; // length of head in pixels
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  context.moveTo(tox, toy);
  context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(C) {
  return "#" + (1 << 24 | C.r << 16 | C.g << 8 | C.b).toString(16).slice(1);
}

function RgbInterpolate(A, B, p){
  const q = 1-p;
  const r = (A.r * p + B.r * q)|0;
  const g = (A.g * p + B.g * q)|0;
  const b = (A.b * p + B.b * q)|0;
  return {r:r, g:g, b:b};
}
var palette_base = [
  "#888075",
  "#d81b60",
  "#f4511e",
  "#ffb300",
  "#7cb342",
  "#1e88e5",
  "#8e24aa"
]
var palette = [];

var CONSOLE = function(){
  this.div = document.createElement("DIV")
  this.div.classList.add("console")
  this.text = "";
  this.textNode = document.createTextNode("@tixlegeek - https://tixlegeek.io");
  this.div.appendChild(this.textNode)
  document.body.appendChild(this.div);

  this.append = function(text){
    this.text += text;
    this.div.innerHTML = this.text;
  }
  this.update = function(text){
    this.text = text;
    this.div.innerHTML = this.text;
  }
}
var steps = 255/palette_base.length|0;
var C = new CONSOLE();
for(c =0; c< palette_base.length-1; c++){
  //var RGB = hexToRgb(palette[c]);
  for(i=steps; i>0; i--){
    var color = RgbInterpolate(hexToRgb(palette_base[0+c]), hexToRgb(palette_base[1+c]), (i/(steps+1)));
    //C.append("<span style='font-weight: bold; color: rgb("+color.r+","+color.g+","+color.b+")'>"+rgbToHex(color)+" "+"rgb("+color.r+","+color.g+","+color.b+")"+"</span> \n")
    palette.push(rgbToHex(color));
  }
}
