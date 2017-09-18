/**
 * @author ObinnaElobi
 * @since 13/9/17
 */

let express = require('express');
let {checkToken} = require("../../../utils/authToken");
let forum = require("./forum");
let permissions = require("./forumauth");
let forumRouter = express.Router();


forumRouter.get("/", forum.getForum);

forumRouter.delete("/del", [checkToken, permissions.modsOnly], forum.deleteForum);

module.exports = forumRouter;