/*jshint esversion: 6 */
let express = require('express');
let {login} = require("./auth");

let {checkToken} = require("../../../utils/authToken");
let {createUser, getUser, deleteUser} = require("./user");

let userRouter = express.Router();

/**
 * login handler
 */

userRouter.get("/", checkToken, getUser);

userRouter.post("/new", createUser);
userRouter.post("/auth", login);

userRouter.delete("/del", checkToken, deleteUser);

module.exports = userRouter;


