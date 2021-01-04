const express = require('express');
const router = express.Router();

router.get('/', checkAuthenticated, (req, res) => {
	res.render('index', {name: req.user.name});
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}



module.exports = router;
