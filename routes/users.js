/*jshint esversion: 6 */
let express = require('express');
let mongoose = require('mongoose')
let jwt    = require('jsonwebtoken');
let User = new require('../models/UserModel');
let userRouter = express.Router();

//=======user specific routes===========//
/**
 * login handler
 */
userRouter.post('/auth', function(req,res){
    User.findOne({
        username: req.body.username
    }, function(err, user){
        if(err)throw err;

        if(!user)res.json({success: false, message: 'Authentication failed. User not found.'});
        else {
            if(!user.validPassword(req.body.password))res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            else{
                let token = jwt.sign(user, userRouter.get('superSecret'),{
                    expiresInMinute : 20
                });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });

            }
        }
    });
});


module.exports = userRouter;


