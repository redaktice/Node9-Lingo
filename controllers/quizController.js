var BeGlobal = require('node-beglobal');
var RandomWords = require('random-words');
var _ = require('underscore');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});

var checkOneLetterOff = function(guess, answer) {
	// put stuff here
};

var quizController = {
	// Get the correct language codes to be used for the quiz and pass them back to quiz.js
	getQuizCodes: function(req, res) {
		var fromLangCode, toLangCode;

		beglobal.languages.all(
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				for (var i = 0; i < results.length; i++) {
			
					var result = results[i].from;

					if (result.name.toLowerCase() === req.query.from.toLowerCase() || result.code === req.query.from.toLowerCase()) {
						fromLangCode = result.code;
					}
					if (result.name.toLowerCase() === req.query.to.toLowerCase() || result.code === req.query.to.toLowerCase()) {
						toLangCode = result.code;
					}
					if (fromLangCode && toLangCode) {
						break;
					}
				}
				res.send({to: toLangCode, from: fromLangCode});
			});
	},
	// Get the next word
	getWord: function(req, res) {

		// If the user wants a word in english, return a random word
		if (req.query.from === 'eng') {
			res.send(RandomWords());
		}
		
		// If the from language is not english, translate the random word and return it
		beglobal.translations.translate(
			{text: RandomWords(), from: 'eng', to: req.query.from},
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				res.send(results.translation);
			});
	},
	// Check to see if the answer is correct and return information
	getAnswer: function(req, res) {

		var correctAnswer;

		beglobal.translations.translate(
			{text: req.query.quizWord, from: req.query.from, to: req.query.to},
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				correctAnswer = results.translation;

				// Create a partial mistake for a "two strikes you're out" policy
				var partialMistake = false;
				
				// Check the answer
				if (req.query.quizGuess.toLowerCase() === correctAnswer.toLowerCase()){
					res.send({correct: true});
				}
				else {
					// Call helper function that runs through 4 tests, returning correct if it passes any of them (one character off) and also returns the type information, we then res.send the return value
					// The helper function returns line 84 if it fails all 4 tests
				}
				// else {
				// 	res.send({correct: false, quizWord: req.query.quizWord, corrected: correctAnswer});
				// }
			});
	}
};

module.exports = quizController;