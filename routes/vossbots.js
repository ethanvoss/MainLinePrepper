const express = require('express');
const router = express.Router();
const { Chess } = require('chess.js')
const chess = new Chess()

router.get('/', (req, res) => {
	res.render('vossbots/index');
});

router.get('/getmove', (req, res) => {
	//takes too long and heroku times out
	if(req.query.fen) {
		//const depth = req.query.depth || 5;
		
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
