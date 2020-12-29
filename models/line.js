const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	positions: {
		type: Array,
		required: true
	},
	startingPosition: {
		type: String,
		required: true
	},
	parentLine: {
		type: String,
		required: false
	},
	transposable: {
		type: Boolean,
		required: false
	},
	side: {
		type: String,
		required: false
	}
})

module.exports = mongoose.model('Line', lineSchema);