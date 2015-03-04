(function(){
  var express = require('express')
  , app = express()
  , path = require('path')
  , bodyParser = require('body-parser')
  , mongoose = require('mongoose')
  , uriUtil = require('mongodb-uri')

  var port = process.env.PORT || 5000;
  
  app.use('/', express.static(path.resolve('build/public')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  
  app.get('/', function(req, res){
    res.send('hello');
  });
  
  app.listen(port);
  console.log('server restarted server fuck!!');
})();