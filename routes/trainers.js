const express = require('express');
const router = express.Router();
const Line = require('../models/line')
/*
index will be line viewer
/editior will be the editor

trainer will be its own route
*/
router.get('/', checkAuthenticated, async (req, res) => {
	res.render('trainers/index');
});




function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}

module.exports = router;