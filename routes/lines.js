const express = require('express');
const router = express.Router();
const Line = require('../models/line')
/*
index will be line viewer
/editior will be the editor

trainer will be its own route
*/
router.get('/', checkAuthenticated, async (req, res) => {
	const lines = await Line.find({userId: req.user._id}).lean();
	const lineIds = [];
	const lineNames = [];
	const startingPositions = [];
	const lockedLines = [];
	const lockedLineParents = [];
	lines.forEach((line) => {
		if(line.transposable === false)
		{
			lockedLines.push(line._id);
			lockedLineParents.push(line.parentLine);	
		}
		lineIds.push(line._id);
		lineNames.push(line.name);
		startingPositions.push(line.startingPosition);
	})
	var initObj = {
		lineIds: lineIds, 
		lineNames: lineNames, 
		startingPositions: startingPositions, 
		lockedLines: lockedLines, 
		lockedLineParents: lockedLineParents
	};
	if(req.query.current)
	{
		initObj.current = req.query.current;
		const currentline = await Line.findOne({_id: req.query.current}, 'positions side').lean();
		initObj.positions = currentline.positions;
		if(currentline.side === 'black') initObj.side = 'black';
	}
	res.render('lines/index', initObj);
});
router.get('/editor', checkAuthenticated, async (req, res) => {
	// const userId = req.user.id;
	// const lines = await Line.find({userId: userId}).lean();
	// console.log(lines);
	const lines = await Line.find({userId: req.user._id}).lean();
	const lineIds = [];
	const lineNames = [];
	const startingPositions = [];
	const lockedLines = [];
	const lockedLineParents = [];
	lines.forEach((line) => {
		if(line.transposable === false)
		{
			lockedLines.push(line._id);
			lockedLineParents.push(line.parentLine);	
		}
		lineIds.push(line._id);
		lineNames.push(line.name);
		startingPositions.push(line.startingPosition);
	})
	
	var initObj = {
		lineIds: lineIds, 
		lineNames: lineNames, 
		startingPositions: startingPositions, 
		lockedLines: lockedLines, 
		lockedLineParents: lockedLineParents
	};
	//console.log(initObj.lines);
	if(req.query.current)
	{
		initObj.current = req.query.current;
		const currentline = await Line.findOne({_id: req.query.current}, 'positions side').lean();
		initObj.positions = currentline.positions;
		if(currentline.side === 'black') initObj.side = 'black';
	}


	res.render('lines/editor', initObj);
});

router.post('/delete', checkAuthenticated, async (req, res) => {
	const id = req.body.id;
	const userId = req.user._id;
	await Line.deleteOne({_id: id});
	res.redirect('/lines/editor');
});

router.post('/new', checkAuthenticated, async (req, res) => {
	const positions = [];
	if(req.body.positions) {
		positions = req.body.positions.split(',');
	} else {	
		positions.push(req.body.startingPosition);
	}
	positions.push(req.body.startingPosition);
	const line = new Line({
		name: 'new line',
		userId: req.user._id,
		positions: positions,
		startingPosition: req.body.startingPosition
	});
	if(req.body.parent) line.parentLine = req.body.parent;
	if(req.body.sidelineindicator) line.transposable = false;
	await line.save();
	var url = '/lines/editor?current=' + line._id;
	res.redirect(url);
	
});

router.post('/updatename', checkAuthenticated, async (req, res) => {
	const lineId = req.body.id;
	const update = {name: req.body.name};
	await Line.findOneAndUpdate({_id: lineId}, update);
	res.redirect('/lines/editor?current=' + lineId);
});

router.post('/updateside', checkAuthenticated, async (req, res) => {
	const lineId = req.body.id;
	const update = {side: req.body.side};
	await Line.findOneAndUpdate({_id: lineId}, update);
	res.redirect('/lines/editor?current=' + lineId);
});

router.post('/newPositions', checkAuthenticated, async (req, res) => {
	const lineId = req.body.id;
	const newPositions = req.body.newPositions.split(',');
	const update = {positions: newPositions};
	await Line.findOneAndUpdate({_id: lineId}, update);
	res.redirect('/lines/editor?current=' + lineId);
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}

module.exports = router;