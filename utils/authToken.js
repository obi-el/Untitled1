/**
 * @author EmmanuelOlaojo
 * @since 1/3/17
 */

let jwt = Promise.promisifyAll(require("jsonwebtoken"));

let config = require("../config/config");
let response = require("./response");
let http = require("./HttpStats");

let moduleId = "authToken";

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

async function createToken(user){
  let {_id, alias} = user;

  return await jwt.signAsync({_id, alias}, config.secret, {expiresIn: "24h"});
}

module.exports = {checkToken, createToken};