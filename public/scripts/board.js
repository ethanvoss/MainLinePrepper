const pieces = ['K','Q','R','B','N','P'];
const collumConvert = ['a','b','c','d','e','f','g','h'];
const rowConvert = ['8','7','6','5','4','3','2','1'];
const rowFlipper = ['7','6','5','4','3','2','1','0'];
const doc = document.documentElement;
var chess;
class Board
{
	//---Construct---//
	constructor(initObj)
	{
		this.width = initObj.width || 400;
		this.size = initObj.size || 8;
		this.locked = initObj.locked || false;
		this.startingFen = initObj.startingFen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
		chess = new Chess(this.startingFen);
		const boardId = initObj.boardId || 'board';
		this.board = document.getElementById(boardId);
		this.position = [];
		this.squares = [];
		const ispercent = Array.from(this.width).includes('%');
		if(ispercent){
		this.board.style.width = this.width;
		}
		else this.board.style.width = this.width + 'px';
		this.board.style.height = this.board.style.width;
		const board = this;

		//---Generates Board---///
		var color = 0;
		var squareSize = this.width / this.size;
		doc.style.setProperty('--square-size', squareSize + "px");
		this.darkColor = initObj.darkColor || "#1e4a66";
		this.lightColor = initObj.lightColor || "#fcfcfc";

		this.updateColors(this.darkColor,this.lightColor);
		
		//update black orientation to be same as white
		if(initObj.orientation == 'black')
		{
			for(var x = this.size - 1; x >= 0; x--)
			{
				for(var y = this.size - 1; y >= 0; y--)
				{
					if(y == this.size - 1) color++;

					var classname;
					if(color % 2 == 0) classname = 'squareDark';
					else classname = 'squareLight';

					const square = document.createElement('div');

					square.setAttribute('class', classname);
					//square.style.background = backgroundColor;
					//if(x == 7) square.style.display = "inline";
					const id = y.toString() + x.toString();
					square.setAttribute('id', id);

					this.squares.push(square);
					this.board.appendChild(square);

					color++;
				}
			}
		}
		else
		{
			for(var x = 0; x < this.size; x++)
			{
				for(var y = 0; y < this.size; y++)
				{
					if(y == 0) color++;

					var classname;
					if(color % 2 == 0) classname = 'squareDark';
					else classname = 'squareLight';

					const square = document.createElement('div');

					square.setAttribute('class', classname);
					//square.style.background = backgroundColor;
					if(x == this.size - 1) square.style.display = "inline";
					const id = y.toString() + x.toString();
					square.setAttribute('id', id);

					this.squares.push(square);
					this.board.appendChild(square);

					color++;
				}
			}
		}
		
		//---Generate position---//
		this.position = generatePosition(this.startingFen);

		//---Display the pieces---//
		displayPieces(this.position, this.locked, this);
	}

	//---Move Function---//
	move(move)
	{
		//----Code for e2-e4 format----//
		var oldPos = move.split('-')[0].split('');
		var newPos = move.split('-')[1].split('');

		var x1, y1;
		for(var i in collumConvert) if(collumConvert[i] == oldPos[0]) x1 = i;
		for(var i in rowConvert) if(rowConvert[i] == oldPos[1]) y1 = i;
		var x2, y2;
		for(var i in collumConvert) if(collumConvert[i] == newPos[0]) x2 = i;
		for(var i in rowConvert) if(rowConvert[i] == newPos[1]) y2 = i;
		var oldSquare = document.getElementById(x1.toString() + y1);
		var newSquare = document.getElementById(x2.toString() + y2);
		var piece = oldSquare.childNodes[0];
		piece.remove();
		newSquare.appendChild(piece);
		board.position[y2][x2] = board.position[y1][x1];
		board.position[y1][x1] = '0';

		//---Capture---//
		if(newSquare.childNodes.length > 1) //piece moved to square already holding a piece
		{
			var children = Array.from(newSquare.childNodes);
			var capturedPiece;
			children.forEach((heldPiece) => {
				if(heldPiece != piece) capturedPiece = heldPiece;
			});
			capturedPiece.remove();
		}
	}
	getFen()
	{
		var outgoing = "";
		for(var r in this.position)
		{
			var row = this.position[r];
			var fenRow;
			if(r > 0) fenRow = "/"; else fenRow = "";
			var emptyCount = 0; 
			row.forEach(squareValue => {
				if(squareValue === "0") emptyCount++;
				else
				{
					if(emptyCount > 0) 
					{
						fenRow += emptyCount.toString();
						emptyCount = 0;
					}
					fenRow += squareValue;
				}
			})
			if(emptyCount > 0) fenRow += emptyCount.toString();
			outgoing += fenRow;
		}
		return outgoing;
	}
	setPosition(fen)
	{
		//gen position
		this.position = generatePosition(fen);

		///remove pieces from board
		this.squares.forEach((square) => {
			if(square.childNodes.length > 0) square.childNodes.forEach((child) => child.remove());
		})
		//replace pieces
		displayPieces(this.position, this.locked, this);

	}
	updateColors(darkColor, lightColor) {
		if (!document.styleSheets) return;
		var myCss = new Array();
		var styleSheet;
		const styleSheets = Array.from(document.styleSheets);

		styleSheets.forEach((sheet) => {
			if(sheet.href == 'https://mainlinetrainer.herokuapp.com/public/css/board.css')
				styleSheet = sheet;
			if(sheet.href == 'http://mainlinetrainer.herokuapp.com/public/css/board.css')
				styleSheet = sheet;
		})


		var index = styleSheets.indexOf(styleSheet);


		if (document.styleSheets[index].cssRules)
			myCss = document.styleSheets[index].cssRules
		else if (document.styleSheets[index].rules)
			myCss = document.styleSheets[index].rules
		else return;

		myCss[5].style.backgroundColor = darkColor;
		myCss[4].style.backgroundColor = lightColor;
	}
	resetColors()
	{
		this.updateColors(this.darkColor, this.lightColor);
	}
}
//--Generates Html for the pieces--//
function genPiece(color, pieceIn, y, x, locked, board)
{
	var pic = color + pieceIn.toUpperCase();
	var img = document.createElement('img');
	img.setAttribute('alt',pieceIn);
	img.setAttribute('src', '../public/img/pieces/' + pic + '.png');
	img.setAttribute('draggable','false');
	img.setAttribute('class', 'pieceImg');
	var piece = document.createElement('div');
	piece.setAttribute('class', 'piece');
	piece.setAttribute('id', 'piece');
	piece.appendChild(img);
	var square = document.getElementById(x+y);
	square.appendChild(piece);
	if(!locked) dragElement(piece, board);
}

function generatePosition(fen)
{
	console.log(fen);
	var tempChess = new Chess(fen);
	console.log(tempChess.fen());
		const fenAsArray = fen.split('/');
		var positionOut = [];
		for(var r in fenAsArray)
		{
			var row = fenAsArray[r].split('');
			var rowOut = [];
			row.forEach((lookingAt) => {
				const isPiece = pieces.some((piece) => {return piece == lookingAt.toUpperCase()});
				if(isPiece) rowOut.push(lookingAt); 
				else 
				{
					var timesToPush = parseInt(lookingAt);
					for(var i = 0; i < timesToPush; i++)
					{
						rowOut.push('0');
					}
				}
			})
			positionOut.push(rowOut);
		}
	return positionOut;
}
function displayPieces(position, locked, board)
{
	for(var r in position)
	{
		var row = position[r];
		for(var c in row)
		{
			var lookingAt = row[c];
			//find if lookingAt is a piece
			pieces.forEach((piece) => {
				if(lookingAt == piece) //white piece
				{
					genPiece('w', lookingAt, r, c, locked, board);
				}else
				if(lookingAt.toUpperCase() == piece) //black piece
				{
					genPiece('b', lookingAt, r, c, locked, board);
				}
			})

		}
	}

}


const boardMove = new Event('boardMove');

//---Make Pieces Draggable---//

function dragElement(elmnt, board) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	elmnt.onmousedown = dragMouseDown;
	elmnt.ontouchstart = dragMouseDown;
	const scale = elmnt.style.width;  
	const imgElmnt = elmnt.childNodes[0];
	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
    // get the mouse cursor position at startup:
    if(e.type == 'touchstart') {
    	pos3 = e.touches[0].clientX;
    	pos4 = e.touches[0].clientY;
    } else {
		pos3 = e.clientX;
	    pos4 = e.clientY;
    }
    

    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.ontouchmove = elementDrag;


	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
	    // calculate the new cursor position:
	    if(e.type == "touchmove") {
	    	console.log(e);
	    	pos1 = pos3 - e.touches[0].clientX;
		    pos2 = pos4 - e.touches[0].clientY;
		    pos3 = e.touches[0].clientX;
		    pos4 = e.touches[0].clientY;
		    console.log(e.touches[0]);
	    } else {
			pos1 = pos3 - e.clientX;
		    pos2 = pos4 - e.clientY;
		    pos3 = e.clientX;
		    pos4 = e.clientY;
	    }
	    
	    // set the element's new position:
	    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
	    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		/* stop moving when mouse button is released: */

		elmnt.appendChild(imgElmnt);

		document.onmouseup = null;
		document.onmousemove = null;
		document.touchend = null;
		document.touchmove = null;

	    //--Snap to square--//
	    var dist = board.width;
	    var targeted;
	    board.squares.forEach((square) => {
	    	var xy = square.getBoundingClientRect();
	    	var xy2 = elmnt.getBoundingClientRect();
	    	var d = Math.sqrt(Math.pow((xy.x - xy2.x),2) + Math.pow((xy.y - xy2.y),2));
	    	if(d < dist)
	    	{
	    		dist = d;
	    		targeted = square;	
	    	} 
	    })
	    var oldPos = elmnt.parentElement.id.split('');
	    var newPos = targeted.id.split('');
		elmnt.remove();
	    targeted.appendChild(elmnt);
	    elmnt.style.left = targeted.style.left;
	    elmnt.style.top = targeted.style.top;
	    if(JSON.stringify(oldPos) !== JSON.stringify(newPos))
	    {
	    	const piece = elmnt.childNodes[0].alt;
	    	//---Castling---//
	    	if(piece == 'K')
	    	{
	    		if(oldPos[0] - newPos[0] > 1) board.move('a1-d1');
	    		if(oldPos[0] - newPos[0] < -1) board.move('h1-f1');	    		
	    	}
	    	if(piece == 'k')
	    	{
	    		if(oldPos[0] - newPos[0] > 1) board.move('a8-d8');
	    		if(oldPos[0] - newPos[0] < -1) board.move('h8-f8');	    		
	    	}


		    //---Capture---//
			if(targeted.childNodes.length > 1) //piece moved to square already holding a piece
			{
				var children = Array.from(targeted.childNodes);
				var capturedPiece;
				children.forEach((heldPiece) => {
					if(heldPiece != elmnt) capturedPiece = heldPiece;
				});
				capturedPiece.remove();
			}

		    var newX = newPos[0], newY = newPos[1], oldX = oldPos[0], oldY = oldPos[1];

		    //find move
		    var x1; for(var i in collumConvert) if(i == oldX) x1 = collumConvert[i];
		    var y1; for(var i in rowConvert) if(i == oldY) y1 = rowConvert[i];
		    var x2; for(var i in collumConvert) if(i == newX) x2 = collumConvert[i];
		    var y2; for(var i in rowConvert) if(i == newY) y2 = rowConvert[i];
		    var move = x1 + y1 + '-' + x2 + y2;

		    //update position
		    board.position[newY][newX] = board.position[oldY][oldX];
		    board.position[oldY][oldX] = '0';

		    boardMove.move = move;
		    boardMove.oldPos = oldPos[0].toString() + oldPos[1].toString();
		    boardMove.newPos = newPos[0].toString() + newPos[1].toString();
		    boardMove.newFen = board.getFen();
		    document.dispatchEvent(boardMove);
	    }

	    
	}
}