/**
 * @author EmmanuelOlaojo
 * @since 8/30/17
 */

let express = require("express");
let apiRouter = express.Router();

let uAuthRouter = require("./auth");
let postRouter = require("./posts");

apiRouter.use("/u", uAuthRouter);
apiRouter.use("/posts", postRouter);

module.exports = apiRouter;