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
    }, async function(err, user){
        if(err)throw err;

        if(!user)res.json({success: false, message: 'Authentication failed. User not found.'});
        else {
            try{
                let isValid = await user.validPassword(req.body.password);

              if(!isValid){
                  res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                  });
              }

              else{
                  // console.log(userRouter.get('superSecret'));
                let token = jwt.sign(user, "issadatabase",{
                  expiresIn : "1h"
                });

                res.json({
                  success: true,
                  message: 'Enjoy your token!',
                  token: token
                });

              }

            }
            catch(err){
                res.json({
                  success: false
                  , err: err
                });
              throw err;

            }
        }
    });
});


module.exports = userRouter;


