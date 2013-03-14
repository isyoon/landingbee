
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mysql = require('mysql')
  , connection = mysql.createConnection(process.env.DATABASE_URL|| 'mysql://be12fd3dd3f884:d6377262@us-cdbr-east-03.cleardb.com/heroku_2a584efb2f39340?reconnect=true');

app = express();

app.configure(function(){
  app.db = connection;
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('__landingbee__'));
  app.use(express.session());
  app.use(app.router);
  //app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});  

var routes = require('./routes')
  , handleDisconnect = function(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
};

handleDisconnect(connection);
app.get('/', routes.index);
app.get('/admin/:password?', routes.admin);
app.get('/nimda/category/add', routes.addCategory);
app.post('/nimda/category/save', routes.saveCategory);
app.get('/nimda/store/add', routes.addStore);
app.get('/nimda/store/stats', routes.showStats);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
