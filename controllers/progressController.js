var mongoose = require('mongoose');
var User = require('../models/userModel.js');
var Quiz = require('../models/quizesModel.js');
var _ = require('underscore');

var progressController = {
	// Get all the progress data
	getProgressData: function(req, res) {

		var progressData = {};

		// Grab all the quizzes with a user's name
		// When multiple users, grab the user's name from the current ID
		Quiz.find({username: 'SuperUser'}, function(err, quizzes) {

			User.findOne({username: 'SuperUser'}, function(err, user) {

				for (var toFromCombo in user.languages) {

				progressData[toFromCombo] = {};

					var relevantQuizzes = _.where(quizzes, {fromLangCode: toFromCombo.split('-')[0],toLangCode: toFromCombo.split('-')[1]});
					// Add the quiz meta-data to the return obj
					progressData[toFromCombo].totalQuizzes = relevantQuizzes.length;

					// Grab all the passed quizzes (or set to 0 if none have been)
					progressData[toFromCombo].passedQuizzes = _.countBy(relevantQuizzes, function(quiz) {
						return quiz.pass;
					})[true] || 0;

					// Get progress quiz data
					progressData[toFromCombo].failedQuizzes = progressData[toFromCombo].totalQuizzes - progressData[toFromCombo].passedQuizzes;
					progressData[toFromCombo].percentagePassed = Math.round(100 * progressData[toFromCombo].passedQuizzes / progressData[toFromCombo].totalQuizzes);

					// Get all the words
					progressData[toFromCombo].totalWords = _.keys(user.languages[toFromCombo].words).length;
					var returnCorrectWords = _.groupBy(user.languages[toFromCombo].words, function(word) {
						return word.correctCount > 0 ? 'correct': 'incorrect';
					});

					// Update progressData words
					progressData[toFromCombo].correctWordsCount = (returnCorrectWords.correct && returnCorrectWords.correct.length) || 0;
					progressData[toFromCombo].failWordsCount = progressData[toFromCombo].totalWords - progressData[toFromCombo].correctWordsCount;
					progressData[toFromCombo].percentageWords = Math.round(100 * progressData[toFromCombo].correctWordsCount / progressData[toFromCombo].totalWords);
					progressData[toFromCombo].bestWords = user.languages[toFromCombo].bestWords;
					progressData[toFromCombo].worstWords = user.languages[toFromCombo].worstWords;

				}
						// Render the progress page with this data (OUTSIDE THE FOR LOOP)
						res.render('progress', {progressData: progressData});
			});
		});
	},
	resetProgress: function(req, res) {

		// Quiz.runCommand({
		// 	delete: 'quizzes',
		// 	deletes: [{q: {username: 'SuperUser'}, limit: 0}]
		// });
		Quiz.remove({username: 'SuperUser'}, function(err) {
			if (err) {
				console.log(err);
				res.send('Error');
			}
			User.findOne({username: 'SuperUser'}, function(err, user) {
				if (err) {
					console.log(err);
					res.send('Error');
				}

				user.languages = {};

				user.markModified('languages');
				user.save(function(err, result) {});

				res.send('Progress Reset');
			});
		});
		// });
	}
};

module.exports = progressController;