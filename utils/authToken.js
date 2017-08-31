/**
 * @author EmmanuelOlaojo
 * @since 1/3/17
 */

let jwt = Promise.promisifyAll(require("jsonwebtoken"));

let config = require("../config/index");
let response = require("./response");
let http = require("./HttpStats");

let moduleId = "authToken";

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

  if(!authToken) return respondErr(http.BAD_REQUEST, "Missing auth token");

  try {
    req.user = await jwt.verifyAsync(authToken, config.secret);
    next();
  }
  catch(err){
    respondErr(http.SERVER_ERROR, config.DEFAULT_ERR_MSG, err);
  }
}

/**
 * Creates a token from a User's details
 *
 * @param user the user
 *
 * @returns {Promise.<*>}
 */
async function createToken(user){
  let {_id, username} = user;

  return await jwt.signAsync({_id, username}, config.secret, {expiresIn: "24h"});
}

module.exports = {checkToken, createToken};