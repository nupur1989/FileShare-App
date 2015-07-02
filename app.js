
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/register')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3090);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/index', function(req, res){
	res.render('index.ejs');
});

app.post('/register', user.register);
app.get('/login', function(req, res){
	res.render('login.ejs');
});


app.post('/main', function(req, res){
	//window.location.href = '/main.ejs' + '#' + 'roohi';
	res.render('main.ejs',{ user1:'roohi' });
	//res.render( 'main.ejs', { user:user } );
});

app.post('/fetch',user.rakhif);
app.get('/rakhi', function(req, res){
	res.render('rakhi.ejs');
});
app.post('/fetchLink',user.rakhil);
app.post('/updateSharedUsers',user.rakhiSharedUser);


app.get('/nupur', function(req, res){
	res.render('nupur.ejs');
});
app.post('/insert',user.rakhiFileInsert);
app.post('/delete',user.rakhiDeletefunction);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
