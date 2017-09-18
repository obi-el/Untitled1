/*jshint esversion: 6 */

let express = require('express');

let auth = require("./auth");
let {checkToken} = require("../../../utils/authToken");
let user = require("./user");

let userRouter = express.Router();

userRouter.route("/")
  .get(checkToken, user.getUser)
  .put(checkToken, user.editUser);

userRouter.get("/all", checkToken, user.getUsers);

userRouter.post("/new", user.createUser);
userRouter.post("/u_auth", auth.login);

userRouter.delete("/del", checkToken, user.deleteUser);

module.exports = userRouter;
