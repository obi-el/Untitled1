let bcrypt = require("bcrypt");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));
let chai = require("chai");
let expect = chai.expect;

let {User} = require("../models");
let http = require("../../utils/HttpStats");
let {port, secret, authToken} = require("../../config");
let {user1, user2} = require("./users");
let SERVER_URL = `http://localhost:${port}`;

module.exports = describe("User", () => {
  let request = chai.request(SERVER_URL);
  let testForum = {
    topic : "Lulz",
    alias: "joe"
  };

  context("Creating a Forum", () => {
    let forumres;

    it("should return a new forum with topic in request", async () =>{
      let userRes = await request.post("/api/u/new").send(user1);
      let {user, token} = userRes.body.result;
      forumres = await request.post("/api/f/new").set(authToken, token).send(testForum);
      let {forum} = forumres.body.result;

      expect(forum.topic).to.equal(testForum.topic);
      expect(forum.mods.find(x => x === testForum.alias), "");
      expect(forum.subs.find(x => x === testForum.alias), "");
    });

  });
});