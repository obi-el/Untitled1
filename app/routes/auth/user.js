/**
 * @author EmmanuelOlaojo
 * @since 8/30/17
 */

let moduleId = "routes/auth/user.js";

let config = require("../../../config");
let {createToken} = require("../../../utils/authToken");
let User = require("../../models/UserModel").User;
let http = require("../../../utils/HttpStats");
let response = require("../../../utils/response");

exports.createUser = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let user = new User();
  let userProps = ["firstName", "lastName", "email", "username", "password"];

  for(let prop of userProps){
    user[prop] = req.body[prop];
  }

  try{
    user = await user.save();
    user = user.toObject();
    delete user.password;

    let token = await createToken(user);

    respond(http.CREATED, "User Created", {user, token});
  }
  catch(err){
    let msg = err.code === config.DUP_ERR
      ? "Too late! Username taken."
      : err.msg || err.message;

    respondErr(http.BAD_REQUEST, msg, err);
  }
};