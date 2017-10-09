// import mongoose ODM package
var mongoose = require('mongoose');

// set Promise for mongoose
mongoose.Promise = global.Promise;
// connect to Mongo using set process environment variable
mongoose.connect(process.env.MONGODB_URI);

// export mongoose setup
module.exports = {mongoose};