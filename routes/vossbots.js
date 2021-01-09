const express = require('express');
const router = express.Router();
const { Chess } = require('chess.js')
const chess = new Chess()

router.get('/', checkAuthenticated, (req, res) => {
	res.render('vossbots/index');
});

router.get('/getmove', (req, res) => {
	//To do: generate all possible moves for a given depth. => eval moves. => return best move
	//pick best move based on what move ends in the highest low or highest of the worst outcomes

	if(req.query.fen) {
		//const depth = req.query.depth || 5;
		const depth = 1;
		var previousPositions = [{fen: req.query.fen}];
		const depthChess = new Chess();
		for(var i = 0; i <= depth; i++)
		{
			var newPositions = [];
			previousPositions.forEach((previousPosition) => {
				depthChess.load(previousPosition.fen);
				const moves = depthChess.moves();
				moves.forEach((move) => {
					depthChess.load(previousPosition.fen);
					depthChess.move(move);
					const eval = evaluateBoard(depthChess.board());
					if(i === depth) {
						const isNewHigh = previousPositions.some((prev) => {
							if(depthChess.turn() === 'b') {
								return prev.eval >= eval;
							} else {
								return prev.eval <= eval;
							}
						});
						if(isNewHigh) newPositions.push({fen: depthChess.fen(), eval: eval, move: move});
					} else
					newPositions.push({fen: depthChess.fen(), eval: eval, move: move});
				})
			})
			previousPositions = newPositions;
		}
		depthChess.load(req.query.fen);
		var side = 1;
		if(depthChess.turn() === 'b') side = -1;
		var bestMove = previousPositions[Math.floor(Math.random() * Math.floor(previousPositions.length))];
		previousPositions.forEach((previousPosition) => {
			if(previousPosition.eval * side > bestMove.eval * side) bestMove = previousPosition;
		})
		res.send(bestMove.move);
	} else {
		res.send('Bee bee boo beep i cant find a move');
	}

	function evaluateBoard(board) {
		const values = [{piece: 'k', value: 900},{piece: 'q', value: 90},{piece: 'r', value: 50},{piece: 'b', value: 30},{piece: 'n', value: 30},{piece: 'p', value: 10}];
		var eval = 0;
		board.forEach((row) => {
			row.forEach((piece) => {
				if(piece !== null) {
					var pieceValueObj = values.find((value) => { return value.piece === piece.type });
					var evalAdd = pieceValueObj.value;
					if(piece.color === 'b') evalAdd *= -1;
					eval += evalAdd;
				}
			})
		});
		return eval;
	}	
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}



module.exports = router;
