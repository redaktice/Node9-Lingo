var BeGlobal = require('node-beglobal');
var RandomWords = require('random-words');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});

var quizController = {
	// Get the correct language codes to be used for the quiz and pass them back to quiz.js
	getQuizCodes: function(req, res) {
		var fromLanguageCode, toLanguageCode;

		beglobal.languages.all(
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				for (var i = 0; i < results.length; i++) {
			
					var result = results[i].from;

					if (result.name.toLowerCase() === req.query.from.toLowerCase()) {
						fromLanguageCode = result.code;
					}
					if (result.name.toLowerCase() === req.query.to.toLowerCase()) {
						toLanguageCode = result.code;
					}
					// if (baseLang && finalLang) {
					// 	break;
					// }
				}
				res.send({to: toLanguageCode, from: fromLanguageCode});
			});
	},
	// Get the next word
	getWord: function(req, res) {
		
		beglobal.translations.translate(
			{text: RandomWords(), from: 'eng', to: req.query.fromLanguageCode},
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				res.send(results.translation);
			});
	},
};

module.exports = quizController;