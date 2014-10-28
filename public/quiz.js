

// Global variables on the quiz.js page
var questionCount, questionsWrong, currentChallengeWord, fromLangCode, toLangCode, quizType;

var quizObj = {
	username: 'SuperUser', // change this to a current user when we have activation
	words: []
};

// Helper function for initializing a new quiz

var getQuestion = function(fromLangCode, toLangCode, type) {
	$.get('/getWord', {username: 'SuperUser', from: fromLangCode, to: toLangCode, quizType: type}, function(challengeWord){
		// Update question count and current challenge word
		questionCount++;
		currentChallengeWord = challengeWord;

		// Display question counts
		$('#q-count').text(questionCount);

		// Display the word
		$('#q-word').text('Translate: "' + challengeWord + '"');

		// Only need to display these when the function is called with parameters (first word)
		if (fromLangCode && toLangCode) {
			// Display the from language
			$('#q-from-lang').text('from ' + fromLangCode);

			// Changing the placeholder
			$('#q-guess').val('').attr('placeholder', 'Translate to ' + toLangCode);
		}
	});
};

// var generateQuiz = function(type) {
// 	questionCount = 0;
// 	questionsWrong = 0;

// 	var fromLang = $('.getQuiz input[name="quizFromLanguage"]').val();
// 	var toLang = $('.getQuiz input[name="quizToLanguage"]').val();

// 	// Update the quiz object
// 	quizObj.fromLang = fromLang;
// 	quizObj.toLang = toLang;

// 	$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
// 	fromLangCode = quizCodes.from;
// 	toLangCode = quizCodes.to;


// 	getQuestion(fromLang, toLang, type, 'random');

// 		$('.getQuiz').fadeOut('1000', function() {
// 			// Toggle the quiz in once the get quiz is toggled out
// 			$('.quizContainer').fadeIn(1000);
// 			$('.responseContainer').hide();
// 		});
// 	});
// };


// Quiz page jQuery
$(document).on('ready', function() {

	// Hide the quiz container until you enter a language
	// USE CSS TO HIDE THESE USING DISPLAY NONE INITIALLY TO AVOID LOAD FLICKER
	$('.quizContainer').hide();
	$('.responseContainer').hide();
	$('.summaryContainer').hide();

	/*--------------------------MAKE QUIZ---------------------------------*/

	// event handler for the get quiz button
	$('#get-quiz').on('click', function(e) {

		questionCount = 0;
		questionsWrong = 0;
		quizType = 'random';

		var fromLang = $('.getQuiz input[name="quizFromLanguage"]').val();
		var toLang = $('.getQuiz input[name="quizToLanguage"]').val();

		

		// 
		$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
			fromLangCode = quizCodes.from;
			toLangCode = quizCodes.to;

			// Update the quiz object
			quizObj.fromLangCode = fromLangCode;
			quizObj.toLangCode = toLangCode;

			getQuestion(fromLangCode, toLangCode, quizType);
			
			$('.getQuiz').fadeOut('1000', function() {
				// Toggle the quiz in once the get quiz is toggled out
				$('.quizContainer').fadeIn(1000);
				$('.responseContainer').hide();
			});
		});

	});



	// event handler for the get quiz button
		$('#get-best-quiz').on('click', function(e) {

			questionCount = 9;
			questionsWrong = 0;

			var fromLang = $('.getQuiz input[name="quizFromLanguage"]').val();
			var toLang = $('.getQuiz input[name="quizToLanguage"]').val();

			// Update the quiz object
			quizObj.fromLang = fromLang;
			quizObj.toLang = toLang;

			// 
			$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
				fromLangCode = quizCodes.from;
				toLangCode = quizCodes.to;

				getQuestion(fromLangCode, toLangCode, 'worstWords');
				
				$('.getQuiz').fadeOut('1000', function() {
					// Toggle the quiz in once the get quiz is toggled out
					$('.quizContainer').fadeIn(1000);
					$('.responseContainer').hide();
				});
			});

		});







		// event handler for the get quiz button
	$('#restart-quiz').on('click', function(e) {

		questionCount = questionsWrong = 0;

		var fromLang = $('.getQuiz input[name="quizFromLanguage"]').val();
		var toLang = $('.getQuiz input[name="quizToLanguage"]').val();

		quizObj = {
			username: 'SuperUser', // change this to a current user when we have activation
			words: []
		};


		$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
			fromLangCode = quizCodes.from;
			toLangCode = quizCodes.to;

		// Update the quiz object
		quizObj.fromLangCode = fromLangCode;
		quizObj.toLangCode = toLangCode;


			getQuestion(fromLang, toLang);
			
			$('.getQuiz').fadeIn('1000', function() {
				// Toggle the quiz container in once the get quiz is toggled out
				$('.quizContainer').fadeOut(1000);
				$('#next-question').show();
				$('.responseContainer').hide();
			});
		});
	});
	/*--------------------------CHECK QUIZ---------------------------------*/

	// When the user submits their answer, check it, and return correction
	$('#submit-answer').on('click', function() {

		if (questionCount === 10) {
			// Hide the next question button
			$('#next-question').hide();
			$('.summaryContainer').show(2000);
		}

		// Check the answer
		$.get('/getAnswer', {quizGuess: $('#q-guess').val(), quizWord: currentChallengeWord.toLowerCase(), from: fromLangCode, to: toLangCode}, function(answerObj) {
				
				// Set up the correctionResponse, if needed
				var correctionResponse = "";

				// Check if answer is fully correct
				if (answerObj.correct && !answerObj.correction) {
					$('#a-response').text('Correct! ' + parseInt(questionCount - questionsWrong) + ' out of ' + questionCount + ' correct so far.');
				}

				// Check if answer is somewhat correct
				else if (answerObj.correct) {
					var quizGuessArray = $('#q-guess').val().split('');
					var quizAnswerArray = answerObj.answer.split('');
					var index = answerObj.index;
					
					// Handle all of the possible almost-right cases
					switch(answerObj.correction) {
						case 'insert':
							for (var i = 0; i < quizAnswerArray.length; i++) {
								if (i === index) {
									correctionResponse += '<strong>' + quizAnswerArray[i] + '</strong>';
								}
								else {
									correctionResponse += quizAnswerArray[i];
								}
							}
							break;

						case 'swap':
							for (var j = 0; j < quizGuessArray.length; j++) {
									if (j === index || j === index + 1) {
										correctionResponse += '<em>' + quizAnswerArray[j] + '</em>';
									}
									else {
										correctionResponse += quizGuessArray[j];
									}
								}
							break;

						case 'delete':
							for (var k = 0; k < quizGuessArray.length; k++) {
									if (k === index) {
										correctionResponse += '<small>' + quizGuessArray[k] + '</small>';
									}
									else {
										correctionResponse += quizGuessArray[k];
									}
								}
							break;

						case 'replace':
							for (var m = 0; m < quizAnswerArray.length; m++) {
								if (m === index) {
									correctionResponse += '<strong><em>' + quizAnswerArray[m] + '</em></strong>';
								}
								else {
									correctionResponse += quizGuessArray[m];
								}
							}
							break;
					}

					$('.responseContainer').prepend('<p id="correction">' + correctionResponse + '</p>');
					$('#a-response').text('Correct! ' + parseInt(questionCount - questionsWrong) + ' out of ' + questionCount + ' correct so far.');
				}

				// If the answer is wrong, update the wrong count
				else {
					questionsWrong++;
					// If three wrong, fail the quiz and let them restart
					if (questionsWrong === 3) {
						$('#a-response').text('Incorrect! The correct answer is ' + answerObj.answer + '. You have gotten three questions wrong and failed the quiz. Try again!');

						// Hide the next question button
						$('#next-question').hide();
					}
					else {
						$('#a-response').text('Incorrect! The correct answer is ' + answerObj.answer + '. ' + questionsWrong + ' out of ' + questionCount + ' wrong so far.');
					}
				}

			// Update the word array in the quiz object
			quizObj.words.push({
				word: currentChallengeWord.toLowerCase(), // String
				answer: answerObj.answer, // String
				guess: $('#q-guess').val().toLowerCase(), //
				correct: answerObj.correct, // Boolean 
				correction: correctionResponse // String

			});
			// If the quiz is over, send to the database
			if (questionCount === 10 || questionsWrong >= 3) {
				// Give a pass or fail
				if (questionsWrong >= 3) {
					quizObj.pass = false;
				}
				else {
					quizObj.pass = true;
				}
				// Post to save quiz, no callback function needed
				// $.post('/saveQuiz', {data: JSON.stringify(quizObj)}, function(){}, 'json');
				$.post('/saveQuiz', quizObj, function(){});
			}

			// Now that all the fields are updated, show the response
			$('.responseContainer').fadeIn('fast');
		});
	});


	/*--------------------------NEXT QUIZ QUESTION---------------------------------*/

	$('#next-question').on('click', function() {

		// Changing the placeholder
		$('#q-guess').val('');

		// Get another question
		$.get('/getWord', {username: 'SuperUser', from: fromLangCode, to: toLangCode, quizType: quizType}, function(challengeWord){
			
			getQuestion(fromLangCode, toLangCode, quizType);
		});
		
		// Maybe put these into a cb within our ajax get
		$('.responseContainer').fadeToggle('fast');
		$('#correction').remove();
	});
});