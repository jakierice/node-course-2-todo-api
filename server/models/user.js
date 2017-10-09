// import required NPM packages
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// define mongoose Schema for User
var UserSchema = new mongoose.Schema({
	// user's email
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	// user's password
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	// all tokens associated to a user
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}
	}]
});

// define method for converting user information to JSON
UserSchema.methods.toJSON = function () {
	// set user to user object the method is called on
	var user = this;
	// convert user to object
	var userObject = user.toObject();

	// return the id and email of the user
	return _.pick(userObject, ['_id', 'email']);
};

// define method for generating an Auth Token for a user
UserSchema.methods.generateAuthToken = function () {
	// set user to user object the method is called on
	var user = this;
	// set access var to string 'auth'
	var access = 'auth';
	// set token to string of JSON Web Token with user's id, access string, and JSON Web Token secret define in process env variable
	var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();

	// add the token to the user's tokens array
	user.tokens.push({ access, token });

	// save the user with generated Auth Token to database
	return user.save().then(() => {
		// return the token
		return token;
	});
};

// define method for removing user's token user for logging user out
UserSchema.methods.removeToken = function (token) {
	// set user to user object method is called on
	var user = this;

	// update the user's database object by removing token
	return user.update({
		$pull: {
			tokens: { token }
		}
	});
};

// define function for retrieving a user with token
UserSchema.statics.findByToken = function (token) {
	// set User to user object function is called on
	var User = this;
	// set empty decoded variable
	var decoded;

	// set decoded var to result of JSON Web Token verified using the passed token and the process env variable secret 
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (e) {
		// reject the Promise if token can't be verified
		return Promise.reject();
	};

	// return matching user if token can be verified
	return User.findOne({
		'_id': decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	});
};

// define function for finding user with email and password (logging user in)
UserSchema.statics.findByCredentials = function (email, password) {
	// set User to user object function is called on
	var User = this;

	// retrieve user by email
	return User.findOne({ email }).then((user) => {
		// reject if user with specified email does not exisit
		if (!user) {
			return Promise.reject();
		}

		// define new Promise to return if user exists
		return new Promise((resolve, reject) => {
			// Use bcrypt.compare to compare password and user.password
			bcrypt.compare(password, user.password, (err, res) => {
				// return a resolved Promise if user's password is successfully compared to entered password
				if (res) {
					resolve(user);
				} else {
					// reject if err when comparing passwords
					reject();
				};
			});
		});
	});
};

// define method for hashing and salting password before saving a password to database
UserSchema.pre('save', function (next) {
	// set user to user object method is called on
	var user = this;

	// user bcrypt to salt and hash password is the user's password is being modified
	if (user.isModified('password')) {
		// salt 10 rounds
		bcrypt.genSalt(10, (err, salt) => {
			// hash the password and salt with the generated salt
			bcrypt.hash(user.password, salt, (err, hash) => {
				// set user's password to hashed result and then continue saving the user to the database
				user.password = hash;
				next();
			});
		});
	} else {
		// continue saving user to database if no modifications have been made to the password
		next();
	};
});

// define User as a mongoose schema with all defined methods and functions
var User = mongoose.model('User', UserSchema);

// export User model
module.exports = { User };