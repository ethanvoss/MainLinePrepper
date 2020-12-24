const express = require('express');
const router = express.Router();
const Line = require('../models/line')
/*
line picker => 
if(sideline) sideline picker =>
trainer
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
	res.render('trainers/index', initObj);
});

router.get('/sideline', checkAuthenticated, async (req, res) => {
	const lines = await Line.find({userId: req.user._id}, 'parentLine').lean();
	const selected = req.query.lineId;
	console.log('selected: ' + selected);
	var sidelines = [];
	lines.forEach((sideline) => {
		console.log(sideline);
		if(sideline.parentLine !== undefined) {
			if(sideline.parentLine === selected)
			{
				sidelines.push(sideline._id);
			}
		}
	})

	console.log(sidelines);
	res.render('trainers/sidelines');
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