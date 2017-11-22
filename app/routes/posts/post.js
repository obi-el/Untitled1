/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */


let moduleId = "/routes/posts/post";

let fs = Promise.promisifyAll(require("fs"));
let Fawn = require("fawn");
let grabity = require("grabity");

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
  let props = ["anon", "type", "title", "raw_text"];
  let post = new Post();

  for(let prop of props){
    post[prop] = req.body[prop];
  }

  post.author = req.user._id;

  try{
    switch(post.type){
      case "image": post = await handleImage(req.file, post);
        break;
      case "video": post = await handleVideo(req.file, post);
        break;
      case "link": post = await handleLink(req.body.link, post);
    }

    respond(http.CREATED, "post", post.toObject());
  }
  catch(err){
    await unlinkFiles(req);
    respondErr(http.SERVER_ERROR, err.message, err);
    console.log(err);
  }
};

async function handleImage(file, post){
  try {
    await files.attachImage(file, post, "image");

    return await post.save();
  }
  catch(err){
    throw err;
  }
}

async function handleVideo(_file, post){
  let task = Fawn.Task();

  try{
    let file = await files.toMp4(_file);
    let {originalname, size, encoding} = file;
    let mimetype = "video/mp4";

    task.saveFile(file.mp4, {
      filename: file.filename
      , metadata: {
        originalname, size, encoding, mimetype
      }
    });
    post.video = {$ojFuture: "0._id"};

    let results = await task.save(post).run({useMongoose: true});
    post = results.length === 1 ? results[0] : results[1];

    await fs.unlinkAsync(file.mp4);
    return post;
  }
  catch(err){
    throw err;
  }
}

async function handleLink(url, post){
  let it;

  try{it = await grabity.grabIt(url);}
  catch(err){it = {};}

  it.url = url;
  post.link = it;

  return await post.save();
}

async function unlinkFiles(req){
  try{
    if(req.file && req.file.mp4) {
      await fs.unlinkAsync(req.file.mp4);
    }
    else if(req.file) {
      await fs.unlinkAsync(req.file.path);
    }
  }
  catch(err) {
    console.log(err) // don't really care about that error
  }
}
