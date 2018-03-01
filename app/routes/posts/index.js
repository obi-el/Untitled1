/**
 * @author EmmanuelOlaojo
 * @since 10/27/17
 */

let multer = require("multer");
let express = require("express");

let postRouter = express.Router();
let upload = multer({dest: "uploads/"});

let auth = require("../../../utils/authToken");
let post = require("./post");

postRouter.route("/")
  .post(auth.checkToken, upload.single("file"), post.createPost);

module.exports = postRouter;