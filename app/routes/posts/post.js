/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */


let moduleId = "/routes/posts/post";

let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let files = require("../../../utils/files");
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
    if(post.type === "image" && req.file){
      await files.attachImage(req.file, post, "image");
    }
    else if(post.type === "video" && req.file){
      let mp4File = await files.uploadVideo(req.file);
      post.video = mp4File._id;
    }

    post = await post.save();

    respond(http.CREATED, "post", post.toObject());
  }
  catch(err){
    console.log(err);
    respondErr(http.BAD_REQUEST, err.message, err);
  }
};
