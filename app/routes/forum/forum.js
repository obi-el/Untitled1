/**
 * @author ObinnaElobi
 * @since 13/9/17
 */

let moduleId = "routes/forum/forum";
let Forum = require("../../models/ForumModel").Forum;
let http = require("../../../utils/HttpStats");
let response = require("../../../utils/response");


/**
 * creates a new Forum
 *
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
exports.createForum = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);

  let forum = new Forum();
  forum[topic] = req.body.topic;
  forum[mods] = [req.body.alias];
  forum[subs] = [req.body.alias];

  try{
    forum = await forum.save();
    forum = forum.toObject();

    respond(http.CREATED, "Forum Created", {user});

  }
  catch(err){
    console.log("error");
    let msg = err.code === config.DUP_ERR
      ? "Too late! Forum topic taken."
      : err.message;

    respondErr(http.BAD_REQUEST, msg, err);
  }

}


/**
 * finds and returns forum with topic in request
 *
 * @param req
 * @param res
 * @returns {Promise.<*>}
 */
exports.getForum = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res);
  let found;

  try{
    found = await Forum.findOne({title: req.query.title});

    if(!found){
      return respondErr(http.NOT_FOUND, "Forum Doesn't Exist");
    }

    respond()
  }
  catch(err){
    respondErr(http.SERVER_ERROR, config.DEFAULT_ERR_MSG, err);
  }

}

/**
 * Deletes forum with topic in request
 *
 * @param req
 * @param res
 * @returns {Promise.<*>}
 */
exports.deleteForum = async function(req,res){
  let respond = response.success(res);
  let respondErr = response.failure(res);

  let query = Forum.findOneAndRemove({topic: req.query.topic});

  try{
    let forum = await query.exec();

    if(!forum){
      return respondErr(http.NOT_FOUND, "Forum not found");
    }

    respond(http.OK, "Forum Deleted Successfully", {user});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err)
  }

}


