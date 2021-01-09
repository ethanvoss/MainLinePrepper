const express = require('express');
const router = express.Router();
const { Chess } = require('chess.js')
const chess = new Chess()

router.get('/', checkAuthenticated, (req, res) => {
	res.render('vossbots/index');
});

router.get('/getmove', (req, res) => {
	//To do: generate all possible moves for a given depth. => eval moves. => return best move

	if(req.query.fen) {
		const values = [{piece: 'k', value: 900},{piece: 'q', value: 90},{piece: 'r', value: 50},{piece: 'b', value: 30},{piece: 'n', value: 30},{piece: 'p', value: 10}];


		const depth1Chess = new Chess(req.query.fen);
		const moves = [];
		depth1Chess.moves().forEach((move) => {
			const tempChess = depth1Chess;
			tempChess.move(move);
			var eval = 0;
			tempChess.board().forEach((row) => {
				row.forEach((piece) => {
					if(piece !== null) {
						var pieceValueObj = values.find((value) => { return value.piece === piece.type });
						var evalAdd = pieceValueObj.value;
						if(piece.color === 'b') evalAdd *= -1;
						eval += evalAdd;
					}
				})
			});
			toPush = {};
			toPush.eval = eval;
			toPush.move = move;
			moves.push(toPush);
		})
		var highest = moves[0];
		if(depth1Chess.turn() === 'b') eval *= -1;
		moves.forEach((currentMove) => {
			if(currentMove.eval > highest.eval) highest = currentMove;
		});
		res.send(highest);
	} else {
		res.send('Bee bee boo beep i cant find a move');
	}	
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}



module.exports = router;
