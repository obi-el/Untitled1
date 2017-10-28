/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */

let express = require("express");
let postRouter = express.Router();

let auth = require("../../../utils/authToken");
let post = require("./post");

postRouter.route("/")
  .post(auth.checkToken, post.createPost);

module.exports = postRouter;