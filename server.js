/*jshint esversion: 6 */
/* eslint-disable */
let express = require('express');
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let compress = require("compression");
let mongoose = require('mongoose');
let Fawn = require("fawn");
mongoose.Promise = global.Promise = require("bluebird");

let {url, port} = require('./config/index');
let apiRouter = require('./app/routes/api');

mongoose.Promise = Promise;
mongoose.connect(url, {useMongoClient: true,});
Fawn.init(require("mongoose"));

let app = express();

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,x-access-token');
  res.setHeader('X-Powered-By', 'The tears of children');
  next();
});

app.use('/api',apiRouter);

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
    console.log('Error: ' + err.stack);
    next(err);
  });
}

/**
 * Roll back any incomplete transactions
 */
(async () => {
  try{await Fawn.Roller().roll()}
  catch(err){throw err;}
})();

// =======================
// start the server ======
// =======================
let server = app.listen(port);

server.on("close", async err => {
  if(err) throw err;

  console.log("\nClosing db connections...\n");
  await mongoose.disconnect();
  console.log("Server Out!! *drops mic*");
});

process.on('SIGINT', () => server.close());

console.log('Magic happens at http://localhost:' + port);
