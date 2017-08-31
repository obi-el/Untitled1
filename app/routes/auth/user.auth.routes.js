/*jshint esversion: 6 */
let express = require('express');
let userRouter = express.Router();
let {login} = require("./auth");

/**
 * login handler
 */
userRouter.post('/auth', login);


module.exports = userRouter;


