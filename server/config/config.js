// set environment
var env = process.env.NODE_ENV || 'development';

// if environment is development or test...
if (env === 'development' || env === 'test') {
	// import config JSON file
	var config = require('./config.json');
	// set the environment config based on the set environment
	var envConfig = config[env];

	// set the process environement variable to the appropriate config
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
}