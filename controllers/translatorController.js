var BeGlobal = require('node-beglobal');

var beglobal = new BeGlobal.BeglobalAPI({
	api_token: 'L%2Fgazni9IdrYgLXwkm3EGg%3D%3D'
});


var translatorController = {
	// Translate the submitted word between the two languages
	translate: function(req, res) {
		
		// First get the language codes
		var fromLangCode, toLangCode;

		beglobal.languages.all(
			function(err, results) {
				if (err) {
					return console.log(err);
				}

				for (var i = 0; i < results.length; i++) {
			
					var result = results[i].from;

					if (result.name.toLowerCase() === req.body.startLang.toLowerCase() || result.code === req.body.startLang.toLowerCase()) {
						fromLangCode = result.code;
					}
					if (result.name.toLowerCase() === req.body.endLang.toLowerCase() || result.code === req.body.endLang.toLowerCase()) {
						toLangCode = result.code;
					}
					if (fromLangCode && toLangCode) {
						break;
					}
				}

				if (!fromLangCode || !toLangCode) {
					res.redirect('/translator?translation=No%20Language%20Found');
					return;
				}

				// Now translate using the language codes
				beglobal.translations.translate(
					{text: req.body.word, from: fromLangCode, to: toLangCode},
					function(err, results) {
						if (err) {
							return console.log(err);
						}
						// Send back the translation results as a query
						res.redirect('/translator?translation=' + results.translation);
					});
			});
	}
};

module.exports = translatorController;