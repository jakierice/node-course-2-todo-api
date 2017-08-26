// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('ERROR: Unable to connect to MongoDB server.');
	};
	console.log('SUCCESS: Connected to MongoDB server.');

	// db.collection('Todos').findOneAndUpdate({
	// 	_id: new ObjectID("59a1a2c99ed7687265d44b4e")
	// }, {
	// 	$set: {
	// 		completed: true
	// 	}
	// }, {
	// 	returnOriginal: false
	// }).then((result) => {
	// 	console.log(result);
	// });
	
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID("59a192efa715402e0c974b3c")
	}, {
		$set: {
			name: 'Jakie Rice'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	// db.close();
});