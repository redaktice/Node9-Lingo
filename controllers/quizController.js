var BeGlobal = require('node-beglobal');
var RandomWords = require('random-words');
var helperFunction = require ('../models/helperFunction.js');
var _ = require('underscore');
var Quiz = require ('../models/quizesModel.js');
var User = require ('../models/userModel.js');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});


var recentWordList = [];
var worstWordList = [];
var leastWordList = [];



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
	setQuiz: function (req, res) {

		Quiz.find({username: 'SuperUser'}, function(err, quizzes) {

			if (quizzes) {
				User.findOne({username: 'SuperUser'}, function(err, user) {

					if (!user.languages[req.query.from + '-' + req.query.to]) {
				user.languages[req.query.from + '-' + req.query.to] = {};
			}
	console.log("From", req.query.from);
	console.log("To", req.query.to);

	console.log("User", user);

					var currentUserLangs = user.languages[req.query.from + '-' + req.query.to];

	console.log("User Langs", currentUserLangs);

						recentWordList = currentUserLangs.recentWords ? currentUserLangs.recentWords : [];
						worstWordList = currentUserLangs.worstWords || [];
						leastWordList = currentUserLangs.leastWords || [];



					var relevantQuizzes = _.where(quizzes, {fromLangCode: req.query.from,toLangCode: req.query.to}) || [];
					
							// Add the quiz meta-data to the return obj
						res.send({
							numberOfQuizzes: relevantQuizzes.length
						});
				});
			}

			else {
				res.send({
					numberOfQuizzes: 0
				});

			}
		});
	},
	// Get the next word
	getWord: function(req, res) {


console.log('Get Word Called');
		User.findOne({username: req.query.username}, function(err, user) {


			var currentUserLangs = user.languages[req.query.from + '-' + req.query.to];
			var randomWord = "";
	console.log("Quiz Type:", req.query.quizType);
			switch(req.query.quizType) {
				case 'recentWords':
					// var recentWordList = currentUserLangs.recentWords;
	console.log('Recent', recentWordList.length);
					recentWordList = _.shuffle(recentWordList);
					randomWord = recentWordList.length > 0 ? recentWordList.pop() : RandomWords();
	console.log('Recent Post Pop', recentWordList.length);

	console.log('Random Word', randomWord);
					break;
				case 'worstWords':
					// var worstWordList = currentUserLangs.worstWords;
	console.log('Worst', worstWordList);
					worstWordList = _.shuffle(worstWordList);
					randomWord = worstWordList.length > 0 ? worstWordList.pop().word : RandomWords();
	console.log('Random Word', randomWord);

					break;
				case 'leastWords':
					// var leastWordList = currentUserLangs.leastWords;
	console.log('Least', leastWordList);
					leastWordList = _.shuffle(leastWordList);
					randomWord = leastWordList.length > 0 ? leastWordList.pop().word : RandomWords();
	console.log('Random Word', randomWord);

					break;
				default: 
					randomWord = RandomWords();
			}
			// If the user wants a word in english, return a random word
			if (req.query.from === 'eng') {
				// res.send(RandomWords());
				res.send(randomWord);
			}
			
			if (req.query.quizType === "random") {
	console.log("Random");
				// If the from language is not english, translate the random word and return it
				beglobal.translations.translate(
					{text: randomWord, from: 'eng', to: req.query.from},
					function(err, results) {
						if (err) {
							return console.log(err);
						}

						res.send(results.translation);
					});
			}
			else {
						// If the from language is not english, translate the random word and return it
				// beglobal.translations.translate(
				// 	{text: randomWord, from: req.query.from, to: req.query.from},
				// 	function(err, results) {
				// 		if (err) {
				// 			return console.log(err);
				// 		}

						res.send(randomWord);
					// });
			}
								user.save(function(err, result) {});

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
				
				var currentUserLangs = userResult.languages[req.body.fromLangCode + '-' + req.body.toLangCode];
				
				if (!currentUserLangs) {
					userResult.languages[req.body.fromLangCode + '-' + req.body.toLangCode] = {
						words: {}
					};
				currentUserLangs = userResult.languages[req.body.fromLangCode + '-' + req.body.toLangCode];
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
						};
					}

					// If there aren't recent words for this language combo, create an empty array
					if (!currentUserLangs.recentWords) {
						currentUserLangs.recentWords = [];
					}
					// Check to see if the current word is in the user's recent words, and if not, add it in (popping off if there's already 10 words) 
					if (currentUserLangs.recentWords.indexOf(result.words[i].word) < 0) {
						if (currentUserLangs.recentWords.length === 10) {
							currentUserLangs.recentWords.pop();
						}
						// Add in the current word
						currentUserLangs.recentWords.unshift(result.words[i].word);
					}
				}

				var allWordsGrouped = _.groupBy(currentUserLangs.words, function(word) {
					return word.correctCount > 0 ? 'correct': 'incorrect';
				});

				// Get the top 10 words correctly translated
				currentUserLangs.bestWords = _.sortBy(allWordsGrouped.correct, function(word) {
						return -1 * word.correctCount;
					}).slice(0,10);

				// Get the 10 words most incorrectly translated
				currentUserLangs.worstWords = _.sortBy(allWordsGrouped.incorrect, function(word) {
						return -1 * word.incorrectCount;
					}).slice(0,10);

				currentUserLangs.leastWords = _.sortBy(currentUserLangs.words, function(word) {
						return word.total;
					}).slice(0,10);


					userResult.markModified('languages');
					// Save it back to the user database
					userResult.save(function(e, saveresult) {
						console.log(saveresult);
						res.send({});
					});
			
			// User.update({username: result.username}, {$inc: {quizCount: 1, quizCorrect: (result.pass && 1 || 0), wordCount: result.words.length}}, {$push: {quizzes: result._id}});
			});
		});
	}
};

module.exports = quizController;