var BeGlobal = require('node-beglobal');
var RandomWords = require('random-words');
var helperFunction = require ('../models/helperFunction.js');
var _ = require('underscore');
var Quiz = require ('../models/quizesModel.js');
var User = require ('../models/userModel.js');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});


// Takes in a guess and answer that do not fully match and checks to see if they are off by just one character
// Creates a return object conntaining boolean 'correct', number 'index' of the error, string 'correction' of what was neeeded to correct the answer, and string 'answer'
var checkOneLetterOff = function(guess, answer) {
	var guessA = guess.split('');
	var answerA = answer.split('');

	var letterSwap = function(index){
		var tempLetter = guessA[index];
		guessA[index] = guessA[index+1];
		guessA[index+1] = tempLetter;
		return guessA;
	};

	for (var i = 0; i < guessA.length; i++) {
		if (answerA[i] === guessA[i]) {
			continue;
		}

		// Insert Letter
		guessA.splice(i, 0, answerA[i]);
		if (guessA.toString() === answerA.toString()) {
			// Return WIN
			console.log('Insert WIN');
			return {correct: true, correction: 'insert', index: i, answer: answer};
		}

		// console.log("Guess Array POST Insert", guessA);
		guessA = guess.split('');
		// console.log("Guess Array Reset Insert", guessA);


		// Swap adjacent letters
		if (letterSwap(i).toString() === answerA.toString()) {
			// Return WIN
			console.log('Swap WIN');
			return {correct: true, correction: 'swap', index: i, answer: answer};
		}
		// console.log("Guess Array POST Swap", guessA);
		guessA = guess.split('');
		// console.log("Guess Array Reset Swap", guessA);

		// Delete one letter
		guessA.splice(i,1);
		if (guessA.toString() === answerA.toString()) {
			// Return WIN
			console.log('Delete WIN');
			return {correct: true, correction: 'delete', index: i, answer: answer};
		}
		// console.log("Guess Array POST Delete", guessA);
		guessA = guess.split('');
		// console.log("Guess Array Reset Delete", guessA);
// console.log(guessA.splice(i,1, answerA[i]));

		// Replace one letter
		guessA.splice(i,1, answerA[i]);
		if (guessA.toString() === answerA.toString()) {
			// Return WIN
			// console.log('Replace WIN');
			return {correct: true, correction: 'replace', index: i, answer: answer};
		}
		// console.log("Guess Array POST Replace", guessA);

		// Return you suck
		// console.log('You suck');
		return {correct: false, answer: answer};
	}
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

	User.findOne({username: req.query.username}, function(err, user) {

		var currentUserLangs = user[req.query.from + '-' + req.query.to];
		var randomWord = "";

		switch(req.query.quiztype) {
			case 'recentWords':
				var recentWordList = currentUserLangs.recentWordList;
				_.shuffle(recentWordList);
				randomWord = recentWordList.pop();
				break;
			case 'worstWords':
				var worstWordList = currentUserLangs.worstWords;
				_.shuffle(worstWordList);
				randomWord = worstWordList.pop();
				break;
			case 'leastWords':
				var leastWordList = currentUserLangs.leastWords;
				_.shuffle(leastWordList);
				randomWord = leastWordList.pop();
				break;
			default: 
				randomWord = RandomWords();
		}
			// If the user wants a word in english, return a random word
			if (req.query.from === 'eng') {
				// res.send(RandomWords());
				res.send(randomWord);
			}
			
			// If the from language is not english, translate the random word and return it
			beglobal.translations.translate(
				{text: randomWord, from: 'eng', to: req.query.from},
				function(err, results) {
					if (err) {
						return console.log(err);
					}

					res.send(results.translation);
				});
		});
	},
	// Check to see if the answer is correct and return information
	getAnswer: function(req, res) {

		var correctAnswer;
		var strippedWord = helperFunction.stripAccent(req.query.quizWord);
		beglobal.translations.translate(
			{text: strippedWord, from: req.query.from, to: req.query.to},
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				correctAnswer = results.translation;

				// Check the answer
				if (req.query.quizGuess.toLowerCase() === correctAnswer.toLowerCase()){
					res.send({correct: true, answer: correctAnswer.toLowerCase()});
				}
				else {
					var correction = checkOneLetterOff(req.query.quizGuess.toLowerCase(), correctAnswer.toLowerCase());
					res.send(correction);
				}
			});
	},
	// Write the quiz object into the database
	saveQuiz: function(req, res) {

		// Create a new Quiz model object using the passed data, save it into the database, and update the entry for the user who took the quiz
		var newQuiz = new Quiz(req.body);
		newQuiz.save(function(err, result) {
			if (err) {
				console.log(err);
			}

			var userwords = User.findOne({username: result.username}, function(err, userResult) {
				
				// console.log(userResult);
				var currentUserLangs = userResult[req.body.fromLangCode + '-' + req.body.toLangCode];
				if (!currentUserLangs) {
					userResult[req.body.fromLangCode + '-' + req.body.toLangCode] = {
						words: {}
					};
				currentUserLangs = userResult[req.body.fromLangCode + '-' + req.body.toLangCode];
				}

				// Go through each word in the quiz
				for (var i = 0; i < result.words.length; i++) {
					
					// If the user already has the word, update the counts
					if (result.words[i].word in currentUserLangs.words) {
						currentUserLangs.words[result.words[i].word].total++;
						if (result.words[i].correct) {
							currentUserLangs.words[result.words[i].word].correctCount++;
						}
						else {
							currentUserLangs.words[result.words[i].word].incorrectCount++;
						}

					}
					// If they do not have the word, add it
					else {
						currentUserLangs.words[result.words[i].word] = {
							word: result.words[i].word,
							total: 1,
							correctCount: result.words[i].correct && 1 || 0,
							incorrectCount: !result.words[i].correct && 1 || 0,
							// fromLangCode: req.body.fromLangCode,
							// toLangCode: req.body.toLangCode
						};
					}
					if (currentUserLangs.recentWords.indexOf(result.words[i].word) < 0 || currentUserLangs.recentWords.length <0) {
						currentUserLangs.recentWords.pop();
						currentUserLangs.recentWords.unshift(result.words[i].word);
					}
				}

				

				var allWordsGrouped = _.groupBy(currentUserLangs.words, function(word) {
					return word.correctCount > 0 ? 'correct': 'incorrect';
				});

				// Get the top 10 words correctly translated
				currentUserLangs.worstWords = _.sortBy(allWordsGrouped.correct, function(word) {
						return -1 * word.correctCount;
					}).slice(0,10);

				// Get the 10 words most incorrectly translated
				currentUserLangs.worstWords = _.sortBy(allWordsGrouped.incorrect, function(word) {
						return -1 * word.incorrectCount;
					}).slice(0,10);

				currentUserLangs.leastWords = _.sortBy(currentUserLangs.words, function(word) {
						return word.total;
					}).slice(0,10);


					userResult.markModified('words');
					// Save it back to the user database
					userResult.save(function(e, saveresult) {
						console.log(saveresult);
					});
			
			// User.update({username: result.username}, {$inc: {quizCount: 1, quizCorrect: (result.pass && 1 || 0), wordCount: result.words.length}}, {$push: {quizzes: result._id}});

			res.send({});
			});
		});
	}
};

module.exports = quizController;