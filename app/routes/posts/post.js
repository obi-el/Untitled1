/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */


let moduleId = "/routes/posts/post";

let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let Post = require("../../models/PostModel").Posts;

exports.createPost = async (req, res) => {
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let props = ["anon", "type", "title", "raw_text", "link"];
  let post = new Post();

  for(let prop of props){
    post[prop] = req.body[prop];
  }

  post.author = req.user._id;

  try{
    post = await post.save();

    console.log("Created post: \n", post);
    respond(http.CREATED, "post", post.toObject());
  }
  catch(err){
    respondErr(http.BAD_REQUEST, err.message, err);
  }
};