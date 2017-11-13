/**
 * @author EmmanuelOlaojo
 * @since 8/30/17
 */

let express = require("express");
let apiRouter = express.Router();

let uAuthRouter = require("./auth");
let postRouter = require("./posts");
let files = require("../../utils/files");
let forumRouter = require("./forum/forum.routes");

apiRouter.use("/u", uAuthRouter);
apiRouter.use("/f", forumRouter);
apiRouter.use("/posts", postRouter);

apiRouter.get("/files", files.stream);

module.exports = apiRouter;