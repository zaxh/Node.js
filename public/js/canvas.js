var can;
var cxt;
var dots = {
	num: 100,
	arrDots: [],
	arrText: ["W","E","B","N","O","D","J","S","V","U"]
};
function init(){
	can = document.getElementById("can");
	cxt = can.getContext("2d");
	can.width = document.body.clientWidth;

	for (var i = 0; i < dots.num; i++) {
		dots.arrDots.push(new drawDot());
		dots.arrDots[i].init();
	}

	animate();
}
window.onload = init;
window.requestAnimFrame = ( function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ) {
            window.setTimeout( callback, 1000 / 60 );
        };
})();
function animate(){
	window.requestAnimationFrame(animate);
	cxt.clearRect(0,0,can.width,can.height);
	Dots();
}
var drawDot = function(){
	this.x;
	this.y;
	//this.r;
	this.n;
	this.speedX;
	this.speedY;
};
drawDot.prototype.init = function(){
	this.x = Math.ceil( Math.random()*can.width );
	this.y = Math.ceil( Math.random()*300 )+200;
	//this.r = Math.ceil( Math.random()*10+1 );
	this.n = Math.floor(Math.random()*10);
	this.speedX = Math.ceil(Math.random()*6)-3;
	this.speedY = Math.ceil(Math.random()*6)-3;
}
drawDot.prototype.update = function(){
	this.x += this.speedX*0.1;
	this.y += this.speedY*0.1;
	if (this.x<0 || this.x>can.width) {
		this.speedX = -this.speedX;
	}
	if(this.y<50 || this.y>500){
        this.speedY = -this.speedY;
    }
}
drawDot.prototype.draw = function(){
	cxt.save();
    cxt.fillStyle="rgba(255,255,255,.6)";
    cxt.beginPath();
    //cxt.arc(this.x,this.y,this.r,0,2*Math.PI,false);
    cxt.textAlign = "center";
    cxt.fillText(dots.arrText[this.n],this.x,this.y);
    cxt.shadowBlur=10;
    cxt.shadowColor="#5d0bf9";
    cxt.fill();
    cxt.closePath();
    cxt.restore();
}
function Dots(){
	for (var i = 0; i < dots.num; i++) {
		dots.arrDots[i].update();
		dots.arrDots[i].draw();
	}
}	