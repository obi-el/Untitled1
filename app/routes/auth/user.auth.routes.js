/*jshint esversion: 6 */
let express = require('express');
let userRouter = express.Router();
let {login} = require("./auth");
let {createUser} = require("./user");

/**
 * login handler
 */

userRouter.post("/new", createUser);
userRouter.post('/auth', login);


module.exports = userRouter;


