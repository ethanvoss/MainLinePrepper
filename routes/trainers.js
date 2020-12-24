const express = require('express');
const router = express.Router();
const Line = require('../models/line')
/*
line picker => 
if(sideline) sideline picker =>
trainer
*/
router.get('/', checkAuthenticated, async (req, res) => {
	res.render('trainers/index');
});

router.get('/sideline', checkAuthenticated, async (req, res) => {
	res.render('trainers/index');
});

router.get('/movetrainer', checkAuthenticated, async (req, res) => {
	res.render('trainers/index');
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}

module.exports = router;