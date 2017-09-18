/**
 * @author EmmanuelOlaojo
 * @author ObinnaElobi
 * @since 8/30/17
 */

let moduleId = "routes/u_auth/user.js";

let config = require("../../../config");
let {createToken} = require("../../../utils/authToken");
let User = require("../../models/UserModel").User;
let http = require("../../../utils/HttpStats");
let response = require("../../../utils/response");

/**
 * Creates a user
 *
 * @param req request
 * @param res response
 *
 * @returns {Promise.<void>}
 */
exports.createUser = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let user = new User();
  let userProps = ["_id", "email", "alias", "password"];

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
    console.log("error");
    let msg = err.code === config.DUP_ERR
      ? "Too late! Username taken."
      : err.message;

    respondErr(http.BAD_REQUEST, msg, err);
  }
};

/**
 * gets a user
 *
 * @param req request
 * @param res response
 *
 * @returns {Promise.<*>}
 */
exports.getUser = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let find;

  if(req.query._id || req.query.alias){
    let {_id, alias} = req.query;
    find = User.findOne(_id ? {_id} : {alias});
  }
  else{
    find = User.findById(req.user._id);
  }

  try{
    let user = await find.exec();

    if(!user){
      return respondErr(http.NOT_FOUND, "User not found");
    }

    respond(http.OK, "User found", {user});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err);
  }
};

/**
 * gets all users
 *
 * @param req request
 * @param res response
 *
 * @returns {Promise.<void>}
 */
exports.getUsers = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);

  try{
    let users = await User.find().exec();

    respond(http.OK, "All Users", {users});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err);
  }
};

exports.editUser = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let props = ["email", "password"];

  try{
    let user = await User.findById(req.user).exec();

    for(let prop of props){
      if(req.body[prop]) user[prop] = req.body[prop];
    }

    user = await user.save();

    respond(http.OK, "User edited successfully", {user});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err);
  }
};

/**
 * deletes logged in user
 *
 * @returns {Promise.<void>}
 */
exports.deleteUser =  async function (req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);

  let query = User.findOneAndRemove({_id: req.user._id});

  try{
    let user = await query.exec();

    if(!user){
      return respondErr(http.NOT_FOUND, "User not found");
    }

    respond(http.OK, "User Deleted Successfully", {user});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err)
  }
};
