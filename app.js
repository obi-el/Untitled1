/*jshint esversion: 6 */

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let User = require('./models/UserModel');
let userRoutes = require('./routes/users');
let testRouter = express.Router();


let configDB = require('./config/database');

let port = process.env.PORT || 8080;


// Database connection Setup
let promise = mongoose.connect(configDB.url, {
    useMongoClient: true,
});

let app = express();


app.set('superSecret', configDB.secret); // secret variable

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
        username: 'Nick Cerminara',
        password: 'password'
    });

    // save the sample user
    nick.save(function(err, nick) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true, result: nick });
    });
});

app.use('/u',userRoutes);
app.use('/',testRouter);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
