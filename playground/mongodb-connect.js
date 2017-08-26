// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('ERROR: Unable to connect to MongoDB server.');
	};
	console.log('SUCCESS: Connected to MongoDB server.');

	// db.collection('Todos').insertOne({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('ERROR: Unable to insert todo.', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, null, 2));
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Jakie Rice',
	// 	age: 25,
	// 	location: 'Houston, TX'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('ERROR: Unable to insert todo.', err);
	// 	}

	// 	// console.log(JSON.stringify(result.ops, null, 2));
	// 	console.log(result.ops[0]._id.getTimestamp());
	// });

	db.close();
});