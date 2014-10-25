var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	toTranslator: function(req, res) {
		res.render('translator', {
			translation: req.query.translation
		});
	},
	toQuiz: function(req, res) {
		res.render('quiz');
	},
	toProgress: function(req, res) {
		res.render('progress'); // Call this with some data, get the data from translatorController
	}
};

module.exports = indexController;


