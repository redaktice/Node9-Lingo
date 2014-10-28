var express = require('express');
var bodyParser = require('body-parser');
var beglobal = require ('node-beglobal');
var mongoose = require ('mongoose');

var indexController = require('./controllers/index.js');
var translatorController = require('./controllers/translatorController.js');
var quizController = require('./controllers/quizController.js');
var progressController = require('./controllers/progressController.js');


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb://localhost/lingoProject');

// HOME PAGE
app.get('/', indexController.index);
app.get('/translator', indexController.toTranslator);
app.get('/quiz', indexController.toQuiz);


// PROGRESS
app.get('/progress', progressController.getProgressData);
app.get('/resetProgress', progressController.resetProgress);

// TRANSLATION PAGE
app.post('/translateRequest', translatorController.translate);

// QUIZ PAGE
app.get('/getQuizCodes', quizController.getQuizCodes);
app.get('/getWord', quizController.getWord);
app.get('/getAnswer', quizController.getAnswer);
app.post('/saveQuiz', quizController.saveQuiz);
app.get('/setQuiz', quizController.setQuiz);

// PROGRESS PAGE
app.get(''); // Handle the redirect -> progress.jade render

var server = app.listen(3929, function() {
	console.log('Express server listening on port ' + server.address().port);
});
