/**
 * @author ObinnaElobi
 * @since 13/9/17
 */

let config = require("../../../config");
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

  let forum = new Forum({_id: req.body._id , topic: req.body.topic, mods: [req.body.alias], subs: [req.body.alias]});
  try{
    forum = await forum.save();

    forum = forum.toObject();

    respond(http.CREATED, "Forum Created", {forum});

  }
  catch(err){
    let msg = err.code === config.DUP_ERR
      ? "Too late! Forum topic taken."
      : err.message;


    respondErr(http.BAD_REQUEST, msg, err);
  }

}


/**
 * finds and returns forum with topic/id in request
 *
 * @param req
 * @param res
 * @returns {Promise.<*>}
 */
exports.getForum = async function(req, res){
  let respond = response.success(res);
  let respondErr = response.failure(res);
  let forum;

  if(req.query._id || req.query.topic){
    let {_id, topic} = req.query;
    forum = Forum.findOne(_id ? {_id} : {topic});
  }


  try{
    forum = await forum.exec();


    if(!forum){
      return respondErr(http.NOT_FOUND, "Forum Doesn't Exist");
    }



    respond(http.OK, "Forum found", {forum})
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

  let query = Forum.findOneAndRemove({topic: req.body.topic});

  try{
    let forum = await query.exec();

    if(!forum){
      return respondErr(http.NOT_FOUND, "Forum not found");
    }

    respond(http.OK, "Forum Deleted Successfully", {forum});
  }
  catch(err){
    respondErr(http.SERVER_ERROR, err.message, err)
  }

}


