/**
 * @author EmmanuelOlaojo
 * @since 8/31/17
 */

let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");
mongoose.Promise = global.Promise = require("bluebird");

let {url} = require("../config");


chai.use(chaiHttp);

describe("All Tests", () => {
  after(async () => {
    let conn = mongoose.createConnection(url, {useMongoClient: true});

    await conn.dropDatabase();
    return await conn.close();
 });

  require("./auth");
});