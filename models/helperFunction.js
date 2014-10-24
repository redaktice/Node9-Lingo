var helperFunction = {
	stripAccent: function (quizWord) {


		// From Solution Set
		var accents = 'ÀÁÂÃÄÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝŸ'.toLowerCase().split('');
		var accentConversion ='AAAAAEEEEIIIINOOOOOUUUUYY'.toLowerCase().split('');

		var quizWordA = quizWord.split('');

		for (var i = 0; i < quizWordA.length; i++) {
			if (accents.indexOf(quizWordA[i]) > -1) {
				quizWordA[i] = accentConversion[accents.indexOf(quizWordA[i])];
			}
			else {
				continue;
			}
		}
		return quizWordA.join('');
	}
};

module.exports = helperFunction;