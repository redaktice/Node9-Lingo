var mongoose = require ('mongoose');

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	words: {} // An object with a word as the key, and each key has total, correctCount, incorrectCount
	// quizCount: Number,
	// quizCorrect: Number,
	// words: Array,
	// quizzes: Array
});

module.exports = mongoose.model('user', userSchema);