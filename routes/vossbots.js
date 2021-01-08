const express = require('express');
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
	res.render('vossbots/index');
});

router.post('/getmove', (req, res) => {
	res.send('yo home slice');
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}



module.exports = router;
