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
		const depth = 3;
		const depthChess = new Chess(req.query.fen);
		const moves = depthChess.moves();
		const movesWithEval = [];
		const side = depthChess.turn();
		moves.forEach((move) => {
			depthChess.load(req.query.fen);
			depthChess.move(move);
			var previousPositions = [{fen: depthChess.fen()}];
			for(var i = 1; i <= depth; i++) {
				var newPositions = [];
				previousPositions.forEach((position) => {
					depthChess.load(position.fen);
					const newMoves = depthChess.moves();
					newMoves.forEach((newMove) => {
						depthChess.load(position.fen);
						depthChess.move(newMove);
						const eval = evaluateBoard(depthChess.board());
						newPositions.push({fen: depthChess.fen(), eval: eval});
					})
				})
				previousPositions = newPositions;
			}
			var sideMult = 1;
			if(side === 'b') sideMult *= -1;
			var worstEval = previousPositions[0];
			previousPositions.forEach((previousPosition) => {
				if(previousPosition.eval * sideMult < worstEval.eval * sideMult) worstEval = previousPosition;
			})
			movesWithEval.push({move: move, eval: worstEval.eval});
		})
		var sideMult = 1;
		if(side === 'b') sideMult *= -1;
		var bestMove = movesWithEval[0];
		movesWithEval.forEach((m) => {
			if(m.eval * sideMult > bestMove.eval) bestMove = m;
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
