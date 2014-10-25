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
		Quiz.find({user: 'SuperUser'}, function(err, quizzes) {
			
			// Add the quiz meta-data to the return obj
			progressData.totalQuizzes = quizzes.length;
			progressData.passedQuizzes = _.countBy(quizzes, function(quiz) {
				return quiz.pass;
			})[true];
			progressData.failedQuizzes = progressData.totalQuizzes - progressData.passedQuizzes;
			progressData.percentagePassed = Math.round(100 * progressData.passedQuizzes / progressData.totalQuizzes);

			User.find({username: 'SuperUser'}, function(err, user) {
				
				console.log(user);
				
				progressData.totalWords = _.keys(user.words).length;
				progressData.correctWords = _.countBy(user.words, function(word) {
					return word.correctCount > 0;
				})[true];
				progressData.failWords = progressData.totalWords - progressData.correctWords;
				progressData.percentageWords = Math.round(100 * progressData.correctWords / progressData.totalWords);
				progressData.bestWords = _.sortBy(user.words, function(word) {
					return -1 * word.correctCount;
				}).slice(0,10);
				progressData.worstWords = _.sortBy(user.words, function(word) {
					return -1 * word.incorrectCount;
				}).slice(0,10);

				res.send(progressData);

			});

		});
	}
};

module.exports = progressController;