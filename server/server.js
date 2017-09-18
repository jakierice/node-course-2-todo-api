var express = require('express');
var bodyParser = require('body-parser');
var { ObjectId } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	// console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});

	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos', (req, res) => {
	Todo.find({}).then((todos) => {
		res.send({
			todos
		});
	}, (e) => {
		res.status(400).send(e);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectId.isValid(id)) {
		return res.status(404).send();
	};
	Todo.findById({ _id: id }).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		};
		res.send({todo});
	}).cathc((e) => {
		res.status(400).send();		
	});
});

app.delete('/todos/:id', (req, res) => {
	// get the id
	var id = req.params.id;
	// validate the id -> not valid? return a 404
	if (!ObjectId.isValid(id)) {
		return res.status(404).send();
	};
	// remove todo by id
	// success
	Todo.findByIdAndRemove(id).then((todo) => {
		// if no doc, send 404
		if (!todo) {
			return res.status(404).send();
		};
		// if doc, send doc back with 200
		res.send(todo);
	// error
	// 400 with empty body
	}).catch((e) => {
		res.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`)
});

module.exports = { app };