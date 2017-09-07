/**
 * @author EmmanuelOlaojo
 * @since 9/5/17
 */

let bcrypt = require("bcrypt");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));
let chai = require("chai");
let expect = chai.expect;

let {User} = require("../models");
let http = require("../../utils/HttpStats");
let {port, secret, authToken} = require("../../config");
let {user1} = require("./users");
let SERVER_URL = `http://localhost:${port}`;

module.exports = describe("User", () => {
  let request = chai.request(SERVER_URL);

  context("Creating a user", () => {
    let userRes;

    it("should return a jwt with user's _id and username", async () => {
      userRes = await request.post("/api/u/new").send(user1);
      let {user, token} = userRes.body.result;
      let {_id, username: _username} = user;
      let decoded = await jwt.verifyAsync(token, secret);
      let {_id: id, username} = decoded;

      expect(id).to.equal(_id);
      expect(username).to.equal(_username);
    });
  })
});