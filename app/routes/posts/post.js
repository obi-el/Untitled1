/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */


let moduleId = "/routes/posts/post";

let fs = Promise.promisifyAll(require("fs"));
let Fawn = require("fawn");

let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let files = require("../../../utils/files");
let Post = require("../../models/PostModel").Posts;

/**
 * Route handler for creating posts.
 *
 * @param req request
 * @param res response
 *
 * @returns {Promise.<void>}
 */
exports.createPost = async (req, res) => {
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let props = ["anon", "type", "title", "raw_text", "link"];
  let post = new Post();
  let task = Fawn.Task();

  for(let prop of props){
    post[prop] = req.body[prop];
  }

  post.author = req.user._id;

  try{
    if(post.type === "image" && req.file){
      await files.attachImage(req.file, post, "image");
    }
    else if(post.type === "video" && req.file){
      let file = await files.toMp4(req.file);

      task.saveFile(file.mp4, {filename: file.filename});
      post.video = {$ojFuture: "0._id"};
    }

    let results = await task.save(post).run({useMongoose: true});

    if(req.file.mp4) await fs.unlinkAsync(req.file.mp4);

    post = results.length === 1 ? results[0] : results[1];
    respond(http.CREATED, "post", post.toObject());
  }
  catch(err){
    try{ // attempt to delete uploaded files if error occurs
      if(req.file && req.file.mp4) await fs.unlinkAsync(req.file.mp4);
      else if(req.file) await fs.unlinkAsync(req.file.path);
    }
    catch(_err){console.log(err)} // don't really care about that error

    respondErr(http.BAD_REQUEST, err.message, err);
  }
};
