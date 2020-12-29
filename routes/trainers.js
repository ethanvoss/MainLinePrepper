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
	const selected = req.query.current;
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
	else res.redirect('/trainer/movetrainer?current='+selected);
});

router.get('/movetrainer', checkAuthenticated, async (req, res) => {
	const line = await Line.findOne({_id: req.query.current}, 'positions startingPosition side').lean();
	const positions = line.positions;
	const startingPosition = line.startingPosition;

	const lineName = await Line.findOne({_id: req.query.current}, 'name').lean();

	const initObj = {
		lineName: lineName.name,
		startingPosition: startingPosition,
		positions: positions
	};

	const side = line.side || null;
	if(side === 'black') initObj.side = 'black';

	if(req.query.sideline)
	{
		const sideline = await Line.findOne({_id: req.query.sideline}, 'positions startingPosition name').lean();
		initObj.sidelinePositions = sideline.positions;
		initObj.sidelineStartingPosition = sideline.startingPosition;
		initObj.sidelineName = sideline.name;
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