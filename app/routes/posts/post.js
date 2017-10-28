/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */


let moduleId = "/routes/posts/post";

let Markdown = require("markdown-it");
let mdEmoji = require("markdown-it-emoji");

let response = require("../../../utils/response");
let http = require("../../../utils/HttpStats");
let Post = require("../../models/PostModel").Posts;

exports.createPost = async (req, res) => {
  let respond = response.success(res);
  let respondErr = response.failure(res, moduleId);
  let props = ["anon", "type", "title", "raw_text", "link"];
  let post = new Post();
  let md = new Markdown({
    linkify: true
    , html: true
  });

  md.use(mdEmoji);
  md.disable("image");

  for(let prop of props){
    post[prop] = req.body[prop];
  }

  post.author = req.user._id;
  post.text = md.render(post.raw_text);

  try{
    post = await post.save();

    console.log("post: ", post);
    respond(http.CREATED, "post", post.toObject());
  }
  catch(err){
    respondErr(http.BAD_REQUEST, err.message, err);
  }
};