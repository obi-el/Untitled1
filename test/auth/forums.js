let types = require("mongoose").Types;
let {user1, user2} = require("./users");

let id = () => types.ObjectId().toString();

exports.testForum1 = {
  topic : "Lulz",
  alias:  user1.alias
};

exports.testForum2 = {
  topic : "Mercy Johnson Nudes",
  alias: user2.alias
};

Object.keys(exports).forEach(key => {
  exports[key]._id = id();
});