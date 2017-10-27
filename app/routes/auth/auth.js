/**
 * @author EmmanuelOlaojo
 * @author ObinnaElobi
 * @since 8/30/17
 */

let moduleId = "routes/auth/auth.js";

let http = require("../../../utils/HttpStats");
let {createToken} = require("../../../utils/authToken");
let User = require("../../models/UserModel").Users;
let {success, failure} = require("../../../utils/response");

/**
 * Users login function
 *
 * @param req request
 * @param res response
 * @returns {Promise.<*>}
 */
exports.login = async function(req, res){
  let respond = success(res);
  let respondErr = failure(res, moduleId);
  let {alias, password} = req.body;

  try {
    let user = await User.findOne({alias}).select("+password").exec();
    let msg = "logged in";

    if (!user){
      msg = "Authentication failed. Users not found."
    }
    else {
      let validPass = await user.validPassword(password);

      if(validPass) {
        let token = await createToken(user);

        return respond(http.OK, msg, {token});
      }
      else msg = "Authentication failed. Invalid password"
    }

    return respondErr(http.UNAUTHORIZED, msg)
  }
  catch (err){
    respondErr(http.SERVER_ERROR, err.message, err)
  }
};