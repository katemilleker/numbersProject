var w = 25;		// width of square in grid, in pixels
var h = 25;		// height of square in grid, in pixels
var canvasPosX = 20;	// x pos of canvas top left corner
var canvasPosY = 20;	// y pos of canvas top left corner
var backCanvas, myCanvas, board;
var columns, rows;
var curr_cols, curr_rows;
var prevCol = 0;
var prevRow = 0;
var insideCanvas = false;		// bool mouse over/out for canvas
var isTouching = true;	
var min_opac_num = 0;
var max_opac_num = 500;
var decCoords = [];		// array of activated elements to decrememnt

// event-triggered functions flag the current state
function inCanvas() {	insideCanvas = true; }
function outCanvas() { insideCanvas = false; }
function touchStarted() { isTouching = true; }
function touchEnded() { isTouching = false; }
function mousePressed() { isTouching = true; }
function mouseClicked() { isTouching = true; }

// disable touch page scrolling, cut copy paste, and right mouse click for mobile
//document.addEventListener("scrollstart", function(e) { e.preventDefault(); }, false);
document.addEventListener("oncut", function(e) { e.preventDefault(); }, false);
document.addEventListener("oncopy", function(e) { e.preventDefault(); }, false);
document.addEventListener("onpaste", function(e) { e.preventDefault(); }, false);
document.addEventListener("contextmenu", function(e) { e.preventDefault(); }, false);

function setup() {
	// p5.dom.js library required locally for dom function .position()	
	myCanvas = createCanvas(windowWidth, windowHeight);
	//myCanvas = createCanvas(windowWidth-w, windowHeight-h-canvasPosY);
	//myCanvas.position(canvasPosX, canvasPosY);
	myCanvas.mouseOver(inCanvas);
	myCanvas.mouseOut(outCanvas);	
	background(0);	// black background
	
	columns = floor(width/w)-1;
	curr_cols = columns;
	rows = floor(height/h)-1;
	curr_rows = rows;
	
	// set up 2D array
	board = new Array(columns);
	for (var i = 0; i < columns; i++) {
		board[i] = new Array(rows);
	} 

	// draw grid, initialize array values
  for (var i = 0; i < columns; i++) {
    for (var j = 0; j < rows; j++) {
      fill(0);	// black canvas 
			//stroke(50); // grey grid lines for testing
			rect(i*w, j*h, w-1, h-1);
			board[i][j] = 1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
	background(0);	// black background
	
	// set up new bounds and 2D array
	curr_cols = floor(width/w)-1;
	curr_rows = floor(height/h)-1;
		
	new_board = new Array(curr_cols);
	for (var i = 0; i < curr_cols; i++) {
		new_board[i] = new Array(curr_rows);
	} 
	
	// draw grid 
  for (var i = 0; i < curr_cols; i++) {
    for (var j = 0; j < curr_rows; j++) {
	    fill(0);	// black canvas 
			//stroke(50); // grey grid lines for testing
			rect(i*w, j*h, w-1, h-1);
		}
	}			
			
	// draw numbers
  for (var i = 0; i < curr_cols; i++) {
    for (var j = 0; j < curr_rows; j++) {
			if (i < columns && j < rows) {
				// copy over exiting values
				new_board[i][j] = board[i][j];
			} else {
				// initialize new values
				new_board[i][j] = 1;
			}
			
			// display all grid text for testing 
			//text(new_board[i][j], i*w+.5*w, j*w+.5*w);
			//textAlign(CENTER, CENTER);
    }
  }
	
	// only update max sizes of col/row/board if expanded
	if (curr_cols > columns) { 
		columns = curr_cols;
		if (curr_rows > rows) {
			row = curr_rows;
			board = new_board;	// board only updated if both col++ and rows++
		}
	}
	else if (curr_rows > rows) {
		rows = curr_rows;
	}
}

// called after setup() and resizeWindow()
function draw() {
	increase(mouseX, mouseY);
	decrease();
}

function increase(mouseX, mouseY) {
	// convert mouse pos to 2D array pos
	// center text inside grid rectangle
	var mouseCol = floor(mouseX/w);
	var mouseRow = floor(mouseY/h);
	var centerX = mouseCol*w + .5*w;
	var centerY = mouseRow*h + .5*h;
	
	// check if incr element is in decrement array
	for (i = 0; i < decCoords.length; i++) {
		if (decCoords[i][0] == mouseCol && decCoords[i][1] == mouseRow)
				decCoords.splice(i,1);	// if found, then remove
	}
	
	// increase and update current grid value
	if (insideCanvas && isTouching && (mouseRow < curr_rows && mouseCol < curr_cols) 
			&& (centerX > 0 && centerY > 0)) {
		// get value of curr and update
		var curr = board[mouseCol][mouseRow];
		board[mouseCol][mouseRow] = increaseCurr(curr);

		//then redraw over previous number
		fill(0);	// black canvas 
		rect(mouseCol*w, mouseRow*h, w-1, h-1);

		// update number value and opacity
		var opac_val = map(curr, min_opac_num, max_opac_num, 50, 255);
		//var opac_val = 255;		// solid white for testing
		fill(opac_val);	// mapped opac val for number
		text(ceil(curr), centerX, centerY);
		textAlign(CENTER,CENTER);
	}
	
	// push previous element to decCoords after mouse moves
	if ((mouseCol != prevCol || mouseRow != prevRow) && 
			(prevCol >= 0 && prevCol < columns) && (prevRow >= 0 && prevRow < rows)) {
			decCoords.push([prevCol,prevRow]);
	}
	
	// push last element to decCoords if finger lifts off screen
	if (!isTouching && (mouseCol == prevCol && mouseRow == prevRow)
			&& (prevCol >= 0 && prevCol < columns) && (prevRow >= 0 && prevRow < rows)) {
			decCoords.push([mouseCol,mouseRow]);
	}
	
	prevCol = mouseCol;
	prevRow = mouseRow;
}

function decrease() {
	for(i = 0; i < decCoords.length; i++) {
		// extract column and row value
		// center text inside grid rectangle
		var decCol = decCoords[i][0];
		var decRow = decCoords[i][1];
		var centerX = decCol*w + .5*w;
		var centerY = decRow*h + .5*h;
		
		// update number value
		var curr = board[decCol][decRow];
		if (curr <= 0) {
			// remove element from dec array if 0
			decCoords.splice(i,1);
		} else {
			// otherwise decrement and redraw text
			board[decCol][decRow] = decreaseCurr(curr);
		}
		// if number visible in grid space, update the canvas with new value and opacity
		// draw black base over previous text
		fill(0);	// black canvas 
		rect(decCol*w, decRow*h, w-1, h-1);
		if (curr > 0) {
			var opac_val = map(curr, min_opac_num, max_opac_num, 50, 255);
			//var opac_val = 255;		// solid white for testing
			fill(opac_val);	// mapped opac val for number
			text(ceil(curr), centerX, centerY);
			textAlign(CENTER,CENTER);	
		}
	}
}

// math for increasing numbers
function increaseCurr(curr) {
	return curr + Math.floor(Math.random()*9) + 1;
}

// math for decreasing numbers
function decreaseCurr(curr) {
	return curr - 0.025;
}

// mapping function for opacity
function map(curr, in_min, in_max, out_min, out_max) {
	return (curr - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}