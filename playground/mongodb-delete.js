// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('ERROR: Unable to connect to MongoDB server.');
	};
	console.log('SUCCESS: Connected to MongoDB server.');

	// deleteMany
	// db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// deleteOne
	// db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
	// 	console.log(result);
	// });

	// findOneAndDelete
	// db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
	// 	console.log(result);
	// });

	// db.collection('Users').deleteMany({name: 'Jakie Rice'});

	db.collection('Users').findOneAndDelete({ _id: new ObjectID("59a19418722fda1f98b69590")}).then((result) => {
		console.log(JSON.stringify(result, null, 2));
	});

	// db.close();
});