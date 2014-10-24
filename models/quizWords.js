var QuizWord = function(word, correct, guess, answer, correction, index) {
	this.word = word;
	this.correct = correct;
	this.guess = guess;
	this.answer = answer;
	this.correction = correction;
	this.index = index;
};


QuizWord.prototype.displayCorrection = function() {

	var correctionResponse = "";
	var quizAnswerArray = this.answer.split('');
	var quizGuessArray = this.guess.split('');

		switch(this.correction) {

			case 'insert':
				for (var i = 0; i < quizAnswerArray.length; i++) {
					if (i === this.index) {
						correctionResponse += '<strong>' + quizAnswerArray[i] + '</strong>';
					}
					else {
						correctionResponse += quizAnswerArray[i];
					}
				}
				break;

			case 'swap':
				for (var j = 0; j < quizGuessArray.length; j++) {
						if (j === this.index || j === this.index + 1) {
							correctionResponse += '<em>' + quizAnswerArray[j] + '</em>';
						}
						else {
							correctionResponse += quizGuessArray[j];
						}
					}
				break;

			case 'delete':
				for (var k = 0; k < quizGuessArray.length; k++) {
						if (k === this.index) {
							correctionResponse += '<small>' + quizGuessArray[k] + '</small>';
						}
						else {
							correctionResponse += quizGuessArray[k];
						}
					}
				break;

			case 'replace':
				for (var m = 0; m < quizAnswerArray.length; m++) {
					if (m === this.index) {
						correctionResponse += '<strong><em>' + quizAnswerArray[m] + '</em></strong>';
					}
					else {
						correctionResponse += quizGuessArray[m];
					}
				}
				break;
}};


module.exports = QuizWord;