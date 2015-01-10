function makeCanvas()
{
	var c = document.getElementById('main');
	var ctx = c.getContext('2d');
	
	
	var bRightBut = false;
	var bLeftBut = false;
	var Score = 0;
	var MaxScore = 0;
	var Y = -1;
	var X = -1;
	var indexX = 0;
	var indexY = 0;
	var level = 3;
	var tileW = 84;
	var tileH = 30;
	var PadH = 25;
	var PadW = 120;
	var rows = 10;
	var cols = 5;
	var prevX = 0;
	var prevY = 0;
	var prevP = 0;
	var txt; 
	var i;
	var j;
	var imgData;
	function ball(x,y)
	{
		this.x = x;
		this.y = y; 

	}
	function pad(x,y,w,h)
	{
		this.x = x;
		this.y = y; 
		this.w = w;
		this.h = h; 

	}
	
	function tiles(w, h, r, c){
		this.w = w;
		this.h = h;
		this.r = r; // rows
		this.c = c; // cols
		this.objs;
	}

	
	var Key = {
	  _pressed: {},

	  RIGHT: 39,
	  LEFT: 37,
	  
	  isDown: function(keyCode) {
		return this._pressed[keyCode];
	  },
	  
	  onKeydown: function(event) {
		this._pressed[event.keyCode] = true;
	  },
	  
	  onKeyup: function(event) {
		delete this._pressed[event.keyCode];
	  }
	};
	
oPad = new pad(c.width / 2 - PadW / 2, c.height-25,PadW,PadH);
oBall = new ball(c.width / 2, c.height-41);
oTiles = new tiles(tileW, tileH, rows, cols);

oTiles.objs = new Array(oTiles.r);
	
	for(i=0; i < oTiles.r; i++)
	{
		oTiles.objs[i] = new Array(oTiles.c);
		for(j=0; j < oTiles.c; j++)
		{
			oTiles.objs[i][j] = 1;
		}
	}

	
function tileLeft() {
	if(oPad.x > 0)
		oPad.x -= 5
}

function tileRight() {
	if(oPad.x < 700)
		oPad.x += 5;
}

function update() {
  
  if (Key.isDown(Key.LEFT)) tileLeft();
  if (Key.isDown(Key.RIGHT)) tileRight();
}
	
function makeGrid(){

	txt = "SCORE: "+ Score;
	document.getElementById("score").innerHTML = txt.bold().fontsize(4.75);
	txt = "MAX SCORE: "+ MaxScore;
	document.getElementById("maxscore").innerHTML = txt.fontsize(4.75).bold();
	txt = "LEVEL: "+ (level - 2);
	document.getElementById("level").innerHTML = txt.fontsize(4.75).bold();
	
	ctx.fillStyle="black";
	ctx.fillRect(0,0,c.width,c.height);
	
	ctx.fillStyle="#ff0000";
	ctx.fillRect(oPad.x, oPad.y, oPad.w, oPad.h);
	
	ctx.fillStyle='#800000';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	
	for(i=0; i < oTiles.r; i++)
	{
		for(j=0; j < oTiles.c; j++)
		{
			oTiles.objs[i][j] = 1;
			ctx.fillRect(i * oTiles.w, j * oTiles.h, oTiles.w,  oTiles.h);
			ctx.strokeRect(i * oTiles.w, j * oTiles.h,  oTiles.w,  oTiles.h);
		}
	}
}


function bounce(){
	bRightBut = false;
	bLeftBut = false;
	prevX = oBall.x;
	prevY = oBall.y;
	prevP = oPad.x;
	
	if(X == 1)
		oBall.x+=level;
	else
		oBall.x-=level;
	
	if(Y == 1)
		oBall.y+=level;
	
	else if (Y == 0)
	{
		alert("Game Over");
		makeGrid();
		oPad.x = c.width / 2 - PadW / 2
		oPad.y = c.height-25;
		oBall.x = c.width / 2;
		oBall.y = c.height - 41;
		Y = -1;
		X = -1;
		prevX = 0;
		prevY = 0;
		if(Score > MaxScore){
			MaxScore = Score;
			txt = "MAX SCORE: "+ MaxScore;
			document.getElementById("maxscore").innerHTML = txt.fontsize(4.75).bold();
		}
		 Score = 0;
	}
	else
		oBall.y-=level;

	
	
	//animating free movement of the ball
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(prevX,prevY,16,0,Math.PI*2);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = "blue";
	ctx.beginPath();
	ctx.arc(oBall.x,oBall.y,15,0,Math.PI*2, true);
	ctx.fill();
	ctx.closePath();
	
	update();
	//animating controlled movement of the pad
	ctx.fillStyle="black";
	ctx.fillRect(prevP, oPad.y, oPad.w, oPad.h);
	
	ctx.fillStyle="#ff0000";
	ctx.fillRect(oPad.x, oPad.y, oPad.w, oPad.h);
	
	//control
	
	if(oBall.x >= c.width)
		X = -1;
	
	else if(oBall.x <= 0)
		X = 1;
		
	if(oBall.y <= 0)
		Y = 1;
	else if(oBall.y >= c.height-20)
		Y = 0;
	
	if(((oBall.x - oPad.x) >= 0) &&((oBall.x - oPad.x) <= oPad.w) && (oBall.y < c.height-20) && (oBall.y >= c.height-40)){
		Y *= -1;
	}
		
	indexX = Math.floor(oBall.x / oTiles.w);
	indexY = Math.floor(oBall.y / oTiles.h);

	if((indexX < oTiles.r) && (indexY < oTiles.c) && (oTiles.objs[indexX][indexY] == 1)){
		ctx.fillStyle="black";
		ctx.fillRect(indexX * oTiles.w, indexY * oTiles.h, oTiles.w, oTiles.h);
		Score++;
		oTiles.objs[indexX][indexY] = 0;
		Y *= -1;
		
	}
	
	txt = "SCORE: "+ Score;
	document.getElementById("score").innerHTML = txt.bold().fontsize(4.75);
	
	if(Score == (oTiles.r * oTiles.c)){
	makeGrid();
		oPad.x = c.width / 2 - PadW / 2
		oPad.y = c.height-25;
		oBall.x = c.width / 2;
		oBall.y = c.height - 41;
		Y = -1;
		X = -1;
		prevX = 0;
		prevY = 0;
		MaxScore = 0;
		Score = 0;
		alert("YOU WON!");
		
	}

		
}
	makeGrid();
	setInterval(bounce,1)
	
	window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
	window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

}


