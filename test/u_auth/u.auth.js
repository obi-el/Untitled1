/**
 * @author EmmanuelOlaojo
 * @since 9/5/17
 */

let bcrypt = require("bcrypt");
let jwt = Promise.promisifyAll(require("jsonwebtoken"));
let chai = require("chai");
let expect = chai.expect;

let {Users} = require("../models");
let http = require("../../utils/HttpStats");
let {port, secret, authToken} = require("../../config");
let {user1, user2, user1alias, user1Email} = require("./users");
let SERVER_URL = `http://localhost:${port}`;

module.exports = describe("Users", () => {
  let request = chai.request(SERVER_URL);

  context("Creating a user", () => {
    let userRes;

    it("should return user and a jwt with user's _id and username", async () => {
      userRes = await request.post("/api/u/new").send(user1);
      let {user, token} = userRes.body.result;
      let decoded = await jwt.verifyAsync(token, secret);
      let {_id, alias} = decoded;

      Object.keys(user).forEach(key => {
        if(user1[key]) expect(user1[key]).to.equal(user[key]);
      });

      expect(user1._id).to.equal(_id);
      expect(user1.alias).to.equal(alias);
    });

    it("should return an error for duplicate alias", async () => {
      try {
        userRes = await request.post("/api/u/new").send(user1alias);
      }
      catch(err){
        let parts = err.response.body.message.split(" ");

        expect(err.status).to.equal(http.BAD_REQUEST);
        expect(parts.indexOf("alias")).to.be.above(-1);
      }
    });

    it("should return an error for duplicate email", async () => {
      try {
        userRes = await request.post("/api/u/new").send(user1Email);
      }
      catch(err){
        let parts = err.response.body.message.split(" ");

        expect(err.status).to.equal(http.BAD_REQUEST);
        expect(parts.indexOf("email")).to.be.above(-1);
      }
    });
  });

  context("Authenticating a user", () => {
    it("should return a jwt with the user's _id and username", async () => {
      let response = await request.post("/api/u/auth").send(user1);
      let {token} = response.body.result;
      let {_id, alias} = await jwt.verifyAsync(token, secret);

      expect(user1._id).to.equal(_id);
      expect(user1.alias).to.equal(alias);
    });
  });

  context("Getting a user",  () => {
    it("should respond with an error if request is unauthenticated", async () => {
      try {
        await request.get("/api/u/").set(authToken, "rubbish").send();
      }
      catch(err) {
        expect(err).to.have.status(http.UNAUTHORIZED);
        expect(err.response.body).to.not.have.property("result");
      }
    });

    it("should return the logged in user if no query params", async () => {
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;
      let userRes = await request.get("/api/u/").set(authToken, token).send();
      let {user} = userRes.body.result;

      expect(user.alias).to.equal(user1.alias);
      expect(user.email).to.equal(user1.email);
      expect(user._id).to.equal(user1._id);
      expect(user).to.not.have.property("password");
    });

    it("should return the user with _id in request's query", async () => {
      // log in
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      // create user2
      await request.post("/api/u/new").send(user2);

      // get user2 with user1's token
      let userRes = await request
        .get(`/api/u/?_id=${user2._id}`)
        .set(authToken, token)
        .send();
      let {user} = userRes.body.result;

      expect(user.alias).to.equal(user2.alias);
      expect(user.email).to.equal(user2.email);
      expect(user._id).to.equal(user2._id);
      expect(user).to.not.have.property("password");
    });

    it("should return the user with alias in request's query", async () => {
      // log in
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      // get user 2 with user1's token
      let userRes = await request
        .get(`/api/u/?alias=${user2.alias}`)
        .set(authToken, token)
        .send();
      let {user} = userRes.body.result;

      expect(user.alias).to.equal(user2.alias);
      expect(user.email).to.equal(user2.email);
      expect(user._id).to.equal(user2._id);
      expect(user).to.not.have.property("password");
    });
  });

  context("Getting all users", () => {
    it("should respond with an error if request is unauthenticated", async () => {
      try {
        await request.get("/api/u/all").set(authToken, "rubbish").send();
      }
      catch(err) {
        expect(err).to.have.status(http.UNAUTHORIZED);
        expect(err.response.body).to.not.have.property("result");
      }
    });

    it("should return all users", async function(){
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      let uRes = await request
        .get("/api/u/all")
        .set(authToken, token)
        .send();
      let {users} = uRes.body.result;
      let dbUsers = await Users.find().exec();

      expect(users.length).to.equal(dbUsers.length);
    });
  });

  context("Editing a user",  async function(){
    it("should respond with an error if request is unauthenticated", async () => {
      try {
        await request.put("/api/u/").set(authToken, "rubbish").send();
      }
      catch(err) {
        expect(err).to.have.status(http.UNAUTHORIZED);
        expect(err.response.body).to.not.have.property("result");
      }
    });

    it("should edit the logged in user's email and password", async () => {
      let res = await request.post("/api/u/auth").send(user2);
      let [email, password] = ["newemail@fakemail.com", "test-password-2"];
      let {token} = res.body.result;

      res = await request.put("/api/u/").set(authToken, token).send({email, password});
      let {user} = res.body.result;
      user = await Users.findById(user).select("+password").exec();
      let validPass = await bcrypt.compare(password, user.password);

      expect(user.email).to.equal(email);
      expect(validPass).to.equal(true);
    });
  });

  context("Deleting Logged in Users", ()=> {
    it("should return and delete the user in requests query", async () => {
      //log in
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      let deleteRes = await request
        .delete("/api/u/del")
        .set(authToken, token)
        .send();
      let {user} = deleteRes.body.result;

      expect(user.alias).to.equal(user1.alias);
      expect(user.email).to.equal(user1.email);
      expect(user._id).to.equal(user1._id);
    });

    it("should return error if request is unauthenticated", async () => {
      try{
        await request
          .delete("/api/u/del")
          .send();
      }
      catch(err) {
        expect(err).to.have.status(http.UNAUTHORIZED);
        expect(err.response.body).to.not.have.property("result");
      }
    });

    it("should return error if Users doesn't exist", async () => {
      await request.post("/api/u/new").send(user1);
      let res = await request.post("/api/u/auth").send(user1);
      let {token} = res.body.result;

      await request
        .delete("/api/u/del")
        .set(authToken, token)
        .send();

      //delete deleted user
      try{
        await request
          .delete("/api/u/del")
          .set(authToken, token)
          .send();
      }
      catch(err) {
        expect(err).to.have.status(http.UNAUTHORIZED);
        expect(err.response.body).to.not.have.property("result");
      }

      try{
        await request
          .get(`/api/u/?alias=${user1.alias}`)
          .set(authToken, token)
          .send();
      }
      catch(err){
        expect(err).to.have.status(http.UNAUTHORIZED);
      }
    });
  });
});