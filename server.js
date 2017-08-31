/*jshint esversion: 6 */

global.Promise = require("bluebird");

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let User = require('./app/models/UserModel');
let apiRouter = require('./app/routes/api');
let testRouter = express.Router();


let config = require('./config/config');

let port = process.env.PORT || 8080;


mongoose.Promise = Promise;
mongoose.connect(config.url, {useMongoClient: true,});

let app = express();


app.set('superSecret', config.secret); // secret variable

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



testRouter.get('/setup', function(req, res) {


  // create a sample user
  let nick = new User({
    username: 'Nick Cerminara'
    , firstName: "Nick"
    , lastName: "Cerminara"
    , email: "dat_boi_cerminara@fakemail.com"
    , password: 'password'
  });

  // save the sample user
  nick.save(function(err, nick) {
    if (err) {
      console.log(err.message);
      throw err;
    }

    console.log('User saved successfully');
    res.json({ success: true, result: nick });
  });
});

app.use('/api',apiRouter);
app.use('/',testRouter);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
