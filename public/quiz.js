// Quiz page jQuery
$(document).on('ready', function() {
	
	// Hide the quiz container until you enter a language
	// USE CSS TO HIDE THESE USING DISPLAY NONE INITIALLY TO AVOID LOAD FLICKER
	$('.quizContainer').hide();
	$('.responseContainer').hide();

	// Variables
	var questionCount = 0;
	var fromLanguageCode, toLanguageCode;

	// event handler for the get quiz button
	$('#getQuiz').on('click', function(e) {
console.log("CLICK");
		var fromLanguage = $('input.getQuiz[name="quizFromLanguage"]').val();
		var toLanguage = $('input.getQuiz[name="quizToLanguage"]').val();

		$.get('/getQuizCodes', {from: fromLanguage, to: toLanguage}, function(quizCodes) {
console.log("GET QUIZ CODE");
			fromLanguageCode = quizCodes.from;
			toLanguageCode = quizCodes.to;

			$.get('/getWord', {from: fromLanguage,}, function(challengeWord){
				// Update question count
				questionCount++;
				$('#q-count').text(questionCount);

				// Display the word
				$('#q-word').text(challengeWord);

				// Display the from language
				$('#from-language').text(fromLanguage);

				// Changing the placeholder
				$('#q-guess').attr('placeholder', 'Translate to ' + toLanguage);
			});

			
			$('.getQuiz').fadeToggle('1000', function() {
				// Toggle the quiz in once the get quiz is toggled out
		console.log('Fade');
				$('.quizContainer').fadeIn(1000);
			});


			
		});

	});

	$('#submitAnswer').on('click', function() {
		// Check the answer
		// $.get('/getAnswer')


		$('.responseContainer').fadeToggle('fast');
	});

	$('#nextQuestion').on('click', function() {
		// Get another question
		// copy paste from above
		// Maybe put these into a cb within our ajax get
		$('.responseContainer').fadeToggle('fast');
	});

});