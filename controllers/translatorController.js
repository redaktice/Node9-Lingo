var BeGlobal = require('node-beglobal');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});


var translatorController = {

	translate: function(req, res) {
		var baseLang, finalLang;

		beglobal.languages.all(
			function(err, results) {
				if (err) {
					return console.log(err);
				}

			

				for (var i = 0; i < results.length; i++) {
			
					var result = results[i].from;

					if (result.name.toLowerCase() === req.body.startLang.toLowerCase()) {
						baseLang = result.code;
					}
					if (result.name.toLowerCase() === req.body.endLang.toLowerCase()) {
						finalLang = result.code;
					}
					if (baseLang && finalLang) {
						break;
					}
				}

				if (!baseLang || !finalLang) {
					res.redirect('/translator?translation=No%20Language%20Found');
					return;
				}

		beglobal.translations.translate(
			{text: req.body.word, from: baseLang, to: finalLang},
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				res.redirect('/translator?translation=' + results.translation);
			});
			});


	

	}
};

module.exports = translatorController;



