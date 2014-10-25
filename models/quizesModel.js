var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
		fromLang: String,
		toLang: String,
		user: String,
		words: [{
			word: String,
			answer: String,
			guess: String,
			correct: Boolean,
			correction: String
		}],
		pass: Boolean
});


module.exports = mongoose.model('quiz', quizSchema);