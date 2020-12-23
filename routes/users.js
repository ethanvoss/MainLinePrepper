const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');

router.get('/', (req, res) => {
	res.render('users/login');
});

router.get('/register', (req, res) => {
	res.render('users/register');
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users',
  failureFlash: true
}))

router.post('/register', async (req, res) => {
	try {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		const user = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		})
		const newUser = await user.save();
		res.redirect('/users');
	} catch {
		res.redirect('/users/register');
	}


});

module.exports = router;