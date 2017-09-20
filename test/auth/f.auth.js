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

  context("Creating a Forum", () => {

  })
}