var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
		fromLang: String,
		toLang: String,
		user: String,
		words: Array,
		pass: boolean
});


module.exports = mongoose.model('quiz', quizSchema);