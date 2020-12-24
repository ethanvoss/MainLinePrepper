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
	const lines = await Line.find({userId: req.user._id}, 'parentLine name').lean();
	const selected = req.query.lineId;
	var sidelines = [];
	var sidelinenames = [];
	lines.forEach((sideline) => {
		if(sideline.parentLine !== undefined) {
			if(sideline.parentLine === selected)
			{
				sidelines.push(sideline._id);
				sidelinenames.push(sideline.name);
			}
		}
	})
	const initObj = {
		current: selected,
		sidelines: sidelines,
		sidelinenames: sidelinenames
	}
	if(sidelines.length > 0) res.render('trainers/sidelines', initObj);
	else res.redirect('/movetrainer?current='+selected);
});

router.get('/movetrainer', checkAuthenticated, async (req, res) => {
	const line = await Line.findOne({_id: req.query.current}, 'positions startingPosition').lean();
	const positions = line.positions;
	const startingPosition = line.startingPosition;
	const initObj = {
		startingPosition: startingPosition,
		positions: positions
	};
	if(req.query.sideline)
	{
		const sideline = await Line.findOne({_id: req.query.sideline}, 'positions startingPosition').lean();
		initObj.sidelinePositions = sideline.positions;
		initObj.sidelineStartingPosition = sideline.startingPosition;
	}

	
	res.render('trainers/movetrainer', initObj);
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/users')
}

module.exports = router;