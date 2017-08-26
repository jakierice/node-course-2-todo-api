// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('ERROR: Unable to connect to MongoDB server.');
	};
	console.log('SUCCESS: Connected to MongoDB server.');

	// db.collection('Todos').find({
	// 	_id: new ObjectID('59a195f89ed7687265d44873')
	// }).toArray().then((docs) => {
	// 	console.log('');
	// 	console.log('TODOS');
	// 	console.log(JSON.stringify(docs, null, 2));
	// }, (err) => {
	// 	console.log('ERROR: Unable to fetch docs.', err);
	// });

	// db.collection('Todos').find().count().then((count) => {
	// 	console.log('');
	// 	console.log(`TODOS count: ${count}`);
	// }, (err) => {
	// 	console.log('ERROR: Unable to fetch docs.', err);
	// });

	db.collection('Users').find({name: 'Jakie Rice'}).toArray().then((docs) => {
		console.log('USERS');
		console.log(JSON.stringify(docs, null, 2));
	}, (err) => {
		if (err) {
			console.log('ERROR: Unable to fetch users.');
		};
	});

	// db.close();
});