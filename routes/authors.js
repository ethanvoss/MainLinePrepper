const express = require('express');
const router = express.Router();
const Author = require('../models/author')

//All authors
router.get('/', async (req, res) => {
	let searchOptions = {};
	console.log(req.query);
	if (req.query.name != null && req.query.name !== '') {
		searchOptions.name = new RegExp(req.query.name, 'i')
	}
	try {
		const authors = await Author.find(searchOptions);
		console.log(authors);
		res.render('authors/index', { authors: authors});
	} catch {
		res.redirect(0, '/', {errorMessage: 'Failed to load /authors'});
	}
});

//New author
router.get('/new', (req, res) => {
	res.render('authors/new', {author: new Author});
});

//Create author
router.post('/', async (req, res) => {
	const author = new Author({
		name: req.body.name
	})
	try{
		const newAuthor = await author.save();
		//res.redirect(`authors/${newAuthor.id}`)
		res.redirect('authors')
	}catch{
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error Creating Author'
		})
	}
});

module.exports = router;