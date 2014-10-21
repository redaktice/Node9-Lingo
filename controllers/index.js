
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
	}
};

module.exports = indexController;


