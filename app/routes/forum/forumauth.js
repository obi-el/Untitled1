/**
 * @author ObinnaElobi
 * @since 13/9/17
 */

let config = require("../config");
let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let moduleId = "forumAuth";
let Forum = require("../../models/ForumModel").Forum;

/**
 * checks if you are a mod in the specified forum
 *
 * @param req request
 * @param res response
 * @param next middleware
 * @returns {Promise.<*>}
 */
exports.checkRole = async function(req,res,next){
  let {alias, topic} = req.query;
  let respondErr = response.failure(res, moduleId);

  try{
    if(!alias || !topic){
      return respondErr(http.BAD_REQUEST, "Missing Parameter " + (!alias) ? "alias" : "title");
    }

    let found = await Forum.findOne({topic: topic}).exec();

    if(!found){
      return respondErr(http.NOT_FOUND, "Forum Doesn't exist");
    }

    let mod = found.mods.find(x => x === alias);

    if(!mod){
      return respondErr(http.UNAUTHORIZED, config.DEFAULT_ERR_MSG);
    }
    next();
  }
  catch(err){
    respondErr(http.UNAUTHORIZED, config.DEFAULT_ERR_MSG, err);
  }

}
