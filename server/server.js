// Init config
require('./config/config');

// Import NPM packages
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

// Import custom modules
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

// Init express server
var app = express();
// set port based on process env var set up in config
const port = process.env.PORT;

// init body-parser as middleware
app.use(bodyParser.json());

// /todos POST route
app.post('/todos', authenticate, (req, res) => {
	// set new todo content
	var todo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});

	// save todo to database
	todo.save().then((doc) => {
		// send the new todo back to client
		res.send(doc);
	}, (e) => {
		// send 400 if error
		res.status(400).send(e);
	});
});

// /todos GET route
app.get('/todos', authenticate, (req, res) => {
	// get all todos associated with the current user's ID
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		// send all todos to client
		res.send({
			todos
		});
	}, (e) => {
		// send 400 if error
		res.status(400).send(e);
	});
});

// /todos/:id GET route for retrieving single todo
app.get('/todos/:id', authenticate, (req, res) => {
	// set id to retrieve
	var id = req.params.id;
	// check that id is valid
	if (!ObjectId.isValid(id)) {
		// respond with 404 if not valid
		return res.status(404).send();
	};
	// find todo with matching id if user._id parameter is set
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		// if todo doesn't exist, send 404
		if (!todo) {
			return res.status(404).send();
		};
		// send todo to client
		res.send({ todo });
	}).catch((e) => {
		// send 400 if error
		res.status(400).send();
	});
});

// /todos/:id DELETE route for deleting single todo
app.delete('/todos/:id', authenticate, (req, res) => {
	// get the id
	var id = req.params.id;
	// validate the id, if not valid return a 404
	if (!ObjectId.isValid(id)) {
		return res.status(404).send();
	};
	// remove todo by id if user._id parameter is set
	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		// if todo does not exist, send 404
		if (!todo) {
			return res.status(404).send();
		};
		// send todo to client
		res.send({ todo });
	}).catch((e) => {
		// send 400 if error
		res.status(400).send();
	});
});

// /todos/:id PATCH route for completing todo
app.patch('/todos/:id', authenticate, (req, res) => {
	// get todo id
	var id = req.params.id;
	// pick the text and completed values from the request body
	var body = _.pick(req.body, ['text', 'completed']);

	// send 404 if id is not valid
	if (!ObjectId.isValid(id)) {
		return res.status(404).send();
	};

	// set body completedAt parameter to current time if completed is boolean and exists
	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		// set body completed parameter to false if not boolean or doesn't exist
		body.completed = false;
		body.completedAt = null;
	};

	// update todo with matching id
	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
		// set the todo with the completed, text, and completedAt body parameters
	}, { $set: body }, { new: true }).then((todo) => {
		// send 404 if there is not matching todo
		if (!todo) {
			return res.status(404).send();
		};

		// send todo to client
		res.send({ todo });
	}).catch((e) => {
		// send 400 if error
		res.status(400).send();
	});
});

// /users POST route for creating new user
app.post('/users', (req, res) => {
	// get email and password from request body
	var body = _.pick(req.body, ['email', 'password']);
	// set user to the information from the request body
	var user = new User(body);

	// save the new user to database
	user.save().then(() => {
		// return a generated Auth Token for the new user
		return user.generateAuthToken();
	}).then((token) => {
		// set an x-auth HTTP header to the returned token value and send back user to client
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		// send 400 if error
		res.status(400).send(e);
	});
});

// /users/me GET route to retrieve user information
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// /users/login POST route for logging in existing user
app.post('/users/login', (req, res) => {
	// get email and password from request body
	var body = _.pick(req.body, ['email', 'password']);

	// find user with matching email and password
	User.findByCredentials(body.email, body.password).then((user) => {
		// return an Auth Token
		return user.generateAuthToken().then((token) => {
			// set HTTP x-auth header to generated token value and send user information to client
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		// send 400 if error
		res.status(400).send();
	});
});

// /users/me/token DELETE route for deleting Auth Token/logging out user
app.delete('/users/me/token', authenticate, (req, res) => {
	// remove user's Auth Token from database
	req.user.removeToken(req.token).then(() => {
		// send 200 if successful
		res.status(200).send();
	}, () => {
		// send 400 if error
		res.status(400).send();
	});
});

// listen on specified server port
app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});

// export server
module.exports = { app };