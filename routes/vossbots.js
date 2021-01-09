const express = require('express');
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
	res.render('vossbots/index');
});

router.post('/getmove', (req, res) => {
	//To do: generate all possible moves for a given depth. => eval moves. => return best move



	res.send('yo home slice');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}



module.exports = router;
