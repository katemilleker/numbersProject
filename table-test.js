var w;
var columns;	// along y axis	
var rows;			// along x axis
var table;	
var mouseCol;
var mouseRow;

function setup() {
	createCanvas(windowWidth-5, windowHeight-5);
	//print("Width = " + width + ", height = " + height);
	background(255);
	w = 30;
	columns = floor(height/w);
	rows = floor(width/w);
	print("Rows = " + rows + ", columns = " + columns);
	
	table = new p5.Table();
	
	for (var i = 0; i < columns; i++) { table.addRow(); }
	for (var j = 0; j < rows; j++) { table.addColumn(); }
	//print(table.getRowCount() + " total rows in table");
	//print(table.getColumnCount() + " total columns in table");
	
	var num = 0;
	for (var r = 0; r < table.getRowCount(); r++) {
		for (var c = 0; c < table.getColumnCount(); c++) {
			table.set(r,c,0);
			text(num, c*w+.5*w, r*w+w);
			num++;
			//print("At (" + i + "," + j + ") = " + table.getNum(i,j) + ", curr = " + curr);
		}
	}
}

function draw() {
	mouseRow = floor(mouseY/w);
	mouseCol = floor(mouseX/w);
		
	//print(table.get(mouseRow, mouseCol));
}
