// import mongoose
var mongoose = require('mongoose');

// define mongoose Todo model
var Todo = mongoose.model('Todo', {
	// text property (the todo's description)
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	// completed property (boolean value for if todo is complete or not)
	completed: {
		type: Boolean,
		default: false
	},
	// completeAt property (time of when todo was completed)
	completedAt: {
		type: Number,
		default: null
	},
	// _creator property (what user created the todo)
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		require: true
	}
});

// export Todo model
module.exports = { Todo };