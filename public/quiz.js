// Global variables on the quiz.js page

var questionCount, questionsWrong, currentChallengeWord, fromLangCode, toLangCode;

// Helper function for initializing a new quiz

var getQuestion = function(fromLang, toLang) {
	$.get('/getWord', {from: fromLangCode}, function(challengeWord){
		// Update question count and current challenge word
		questionCount++;
		currentChallengeWord = challengeWord;

		// Display question counts
		$('#q-count').text(questionCount);

		// Display the word
		$('#q-word').text('Translate: "' + challengeWord + '"');

		if (fromLang && toLang) {
			// Display the from language
			$('#q-from-lang').text('from ' + fromLang);

			// Changing the placeholder
			$('#q-guess').val('').attr('placeholder', 'Translate to ' + toLang);
		}
	});
};

// Quiz page jQuery
$(document).on('ready', function() {
	
	// Hide the quiz container until you enter a language
	// USE CSS TO HIDE THESE USING DISPLAY NONE INITIALLY TO AVOID LOAD FLICKER
	$('.quizContainer').hide();
	$('.responseContainer').hide();

	/*--------------------------MAKE QUIZ---------------------------------*/

	// event handler for the get quiz button
	$('#get-quiz').on('click', function(e) {

		questionCount = questionsWrong = 0;

		var fromLang = $('.getQuiz input[name="quizFromLanguage"]').val();
		var toLang = $('.getQuiz input[name="quizToLanguage"]').val();

		$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
			fromLangCode = quizCodes.from;
			toLangCode = quizCodes.to;

			getQuestion(fromLang, toLang);
			
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

		$.get('/getQuizCodes', {from: fromLang, to: toLang}, function(quizCodes) {
			fromLangCode = quizCodes.from;
			toLangCode = quizCodes.to;

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
	$('#submitAnswer').on('click', function() {
		// Check the answer
		$.get('/getAnswer', {quizGuess: $('#q-guess').val(), quizWord: currentChallengeWord, from: fromLangCode, to: toLangCode}, function(answerObj) {
				
				// Display whether question is right or wrong, update questionsWrong
				if (answerObj.correct) {
					$('#a-response').text('Correct! ' + parseInt(questionCount - questionsWrong) + ' out of ' + questionCount + ' correct so far.');
					// Add in the more complex psuedo-correct messages later
				}
				else {
					questionsWrong++;
					// If three wrong, fail the quiz and let them restart
					if (questionsWrong === 3) {
						$('#a-response').text('Incorrect! The correct answer is ' + answerObj.corrected + '. You have gotten three questions wrong and failed the quiz. Try again!');

						// Hide the next question button
						$('#next-question').hide();
					}
					$('#a-response').text('Incorrect! The correct answer is ' + answerObj.corrected + '. ' + questionsWrong + ' out of ' +questionCount + ' wrong so far.');
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
		$.get('/getWord', {from: fromLangCode,}, function(challengeWord){
			
			getQuestion();
		});
		
		// Maybe put these into a cb within our ajax get
		$('.responseContainer').fadeToggle('fast');
	});

});