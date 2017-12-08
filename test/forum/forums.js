let types = require("mongoose").Types;
let {user1, user2} = require("../u_auth/users");

let id = () => types.ObjectId().toString();

exports.testForum1 = {
  topic : "Lulz",
  user:  user1._id
};

exports.testForum2 = {
  topic : "Mercy Johnson Nudes",
  user: user2._id
};

Object.keys(exports).forEach(key => {
  exports[key]._id = id();
});