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

		// console.log(user);
				for (var toFromCombo in user) {

					var relevantQuizzes = _.where(quizzes, {fromLangCode: toFromCombo.split('-')[0],toLangCode: toFromCombo.split('-')[1]});
				// Add the quiz meta-data to the return obj
					progressData[toFromCombo].totalQuizzes = relevantQuizzes.length;
					progressData[toFromCombo].passedQuizzes = _.countBy(relevantQuizzes, function(quiz) {
						return quiz.pass;
					})[true];
					progressData[toFromCombo].failedQuizzes = progressData[toFromCombo].totalQuizzes - progressData[toFromCombo].passedQuizzes;
					progressData[toFromCombo].percentagePassed = Math.round(100 * progressData[toFromCombo].passedQuizzes / progressData[toFromCombo].totalQuizzes);

					if (toFromCombo !== 'password' && toFromCombo !== 'username') {
		
						progressData[toFromCombo].totalWords = _.keys(user[toFromCombo].words).length;
						var returnCorrectWords = _.groupBy(user[toFromCombo].words, function(word) {
							return word.correctCount > 0 ? 'correct': 'incorrect';
						});

			// console.log("Return Correct", returnCorrectWords);
						progressData[toFromCombo].correctWordsCount = (returnCorrectWords.correct && returnCorrectWords.correct.length) || 0;
						progressData[toFromCombo].failWordsCount = progressData[toFromCombo].totalWords - progressData[toFromCombo].correctWordsCount;
						progressData[toFromCombo].percentageWords = Math.round(100 * progressData[toFromCombo].correctWordsCount / progressData[toFromCombo].totalWords);
						progressData[toFromCombo].bestWords = user.
						progressData[toFromCombo].worstWords = _.sortBy(returnCorrectWords.incorrect, function(word) {
							return -1 * word.incorrectCount;
						}).slice(0,10);
						// progressData[toFromCombo].correctWordsCount = 
		// console.log("Organized Worst", organizedWorstWords);
						res.render('progress', progressData);
						console.log(progressData);
					}
				}
			});
		});
	}
};

module.exports = progressController;