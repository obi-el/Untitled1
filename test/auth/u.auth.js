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

    it("should return user and a jwt with user's _id and username", async () => {
      userRes = await request.post("/api/u/new").send(user1);
      let {user, token} = userRes.body.result;
      let decoded = await jwt.verifyAsync(token, secret);
      let {_id, username} = decoded;

      Object.keys(user).forEach(key => {
        if(user1[key]) expect(user1[key]).to.equal(user[key]);
      });

      expect(user1._id).to.equal(_id);
      expect(user1.username).to.equal(username);
    });
  });

  context("Authenticating a user", async () => {
    it("should return a jwt with the user's _id and username", async () => {
      let response = await request.post("/api/u/auth").send(user1);
      let {token} = response.body.result;
      let {_id, username} = await jwt.verifyAsync(token, secret);

      expect(user1._id).to.equal(_id);
      expect(user1.username).to.equal(username);
    });
  });
});