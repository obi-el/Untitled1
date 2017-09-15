/**
 * @author EmmanuelOlaojo
 * @since 8/30/17
 */

let express = require("express");
let apiRouter = express.Router();
let uAuthRouter = require("./auth/user.auth.routes");
let forumRouter = require("./forum/forum.routes");

apiRouter.use("/u", uAuthRouter);
apiRouter.use("/f", forumRouter);

module.exports = apiRouter;