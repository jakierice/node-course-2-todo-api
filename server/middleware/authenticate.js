// import User model
var { User } = require('./../models/user');

// define authenticate middleware module
var authenticate = (req, res, next) => {
	// set token to the request x-auth header
	var token = req.header('x-auth');

	// get user with matching token
	User.findByToken(token).then((user) => {
		// if user does not exist reject the promise
		if (!user) {
			return Promise.reject();
		};
		
		// set request user parameter to matching user
		req.user = user;
		// set request token to set x-auth token
		req.token = token;
		next();
	}).catch((e) => {
		// send 401 (not authorized) if user does not exist or can't be authenticated
		res.status(401).send();
	});
};

// export authenticate middleware
module.exports = { authenticate };