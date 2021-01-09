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
		const depth1Chess = new Chess(req.query.fen);
		const moves = [];
		boardMoves = depth1Chess.moves();
		boardMoves.forEach((move) => {
			console.log(`Move ${move}`);
		})
		//const depth = req.query.depth || 5;
		//const moves = [];
		res.send('im not sure');
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
