const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

var id = '59a1dcfc1240adbc2271356f';

// if (!ObjectID.isValid(id)) {
// 	console.log('ERROR: ID not valid');
// };

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if (!todo) {
// 		return console.log('ERROR: ID not found');
// 	};
// 	console.log('Todo by Id', todo);
// }).catch((e) => console.log(e));

User.findById('59a1b2bd7ef0f0901ddd5dcb').then((user) => {
	if (!user) {
		return console.log('ERROR: Unable to find user');
	};

	console.log(JSON.stringify(user, null, 2));
}, (e) => {
	console.log(e);
});