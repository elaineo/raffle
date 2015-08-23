
/**
 * Module dependencies.
 */
require( './db' );

var express = require('express');
var cookieParser = require('cookie-parser')
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var engine  = require( 'ejs-locals' );

// all environments
app.set('port', process.env.PORT || 3000);
app.engine( 'ejs', engine );
app.set('views', path.join(__dirname, 'views'));
app.set( 'view engine', 'ejs' );
app.use(express.favicon());
app.use(express.logger('dev'));
app.use( express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(cookieParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.find);
app.post( '/create', routes.create );
app.get( '/destroy/:id', routes.destroy );
app.get( '/add/:id', routes.add );
app.get( '/show/:id', routes.show );


http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});
