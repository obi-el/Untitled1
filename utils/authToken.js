/**
 * @author EmmanuelOlaojo
 * @since 1/3/17
 */

let jwt = Promise.promisifyAll(require("jsonwebtoken"));

let config = require("../config");
let response = require("./response");
let http = require("./HttpStats");
let Users = require("../app/models/UserModel").Users;

let moduleId = "utils/authToken";

/**
 * Checks that a user has a valid token
 * i.e. is logged in
 *
 * @param req request
 * @param res response
 * @param next next middleware
 *
 * @returns {Promise.<*>}
 */
async function checkToken(req, res, next){
  let respondErr = response.failure(res, moduleId);
  let authToken = req.get(config.authToken);

  if(!authToken) return respondErr(http.UNAUTHORIZED, "Missing u_auth token");

  try {
    let user = await jwt.verifyAsync(authToken, config.secret);
    user = await Users.findById(user._id);

    if(!user){
      return respondErr(http.UNAUTHORIZED, "User no longer exists");
    }

    req.user = user;

    next();
  }
  catch(err){
    respondErr(http.UNAUTHORIZED, config.DEFAULT_ERR_MSG, err);
  }
}

/**
 * Creates a token from a Users's details
 *
 * @param user the user
 *
 * @returns {Promise.<*>}
 */
async function createToken(user){
  let {_id, alias} = user;

  return await jwt.signAsync({_id, alias}, config.secret, {expiresIn: "24h"});
}

module.exports = {checkToken, createToken};