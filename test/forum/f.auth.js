let bcrypt = require("bcrypt");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));
let chai = require("chai");
let expect = chai.expect;

let {Forum} = require("../models/index");
let http = require("../../utils/HttpStats");
let {port, secret, authToken} = require("../../config/index");
let {user1} = require("../u_auth/users");
let {testForum1} = require("./forums");
let SERVER_URL = `http://localhost:${port}`;

module.exports = describe("User", () => {
  let request = chai.request(SERVER_URL);


  context("Creating a Forum", () => {
    let forumres;

    it("should return a new forum with topic in request", async () =>{
      let userRes = await request.post("/api/u/new").send(user1);
      let {token} = userRes.body.result;
      forumres = await request.post("/api/f/new").set(authToken, token).send(testForum1);
      let {forum} = forumres.body.result;

      expect(forum.topic).to.equal(testForum1.topic);
      expect(forum.mods.find(x => x === testForum1.alias));
      expect(forum.subs.find(x => x === testForum1.alias));
      expect(forum._id).to.equal(testForum1._id);
    });

  });

  context("Getting a forum", () => {
    it("should return forum with _id in request", async ()=>{
      await request.post("/api/u/auth").send(user1);

      let res = await request.get(`/api/f/?_id=${testForum1._id}`).send();
      let {forum} = res.body.result;

      expect(forum._id).to.equal(testForum1._id);
    });

    it("should return forum with topic in request", async ()=>{
      await request.post("/api/u/auth").send(user1);

      let res = await request.get(`/api/f/?topic=${testForum1.topic}`).send();
      let {forum} = res.body.result;

      expect(forum.topic).to.equal(testForum1.topic);
    });
  });

  context("Deleting a forum", () => {

    it("should delete forum with topic in request", async () => {
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      let deleteRes = await request
        .delete("/api/f/del")
        .set(authToken, token)
        .send(testForum1);

      let {forum} =  deleteRes.body.result;

      expect(forum.topic).to.equal(testForum1.topic);
      expect(forum._id).to.equal(testForum1._id);
    });


  });

});