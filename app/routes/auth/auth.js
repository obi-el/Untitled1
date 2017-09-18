/**
 * @author EmmanuelOlaojo
 * @author ObinnaElobi
 * @since 8/30/17
 */

let moduleId = "routes/u_auth/u_auth.js";

let http = require("../../../utils/HttpStats");
let {createToken} = require("../../../utils/authToken");
let User = require("../../models/UserModel").User;
let {success, failure} = require("../../../utils/response");

/**
 * User login function
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
      msg = "Authentication failed. User not found."
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