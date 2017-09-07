/**
 * @author EmmanuelOlaojo
 * @since 9/5/17
 */

let types = require("mongoose").Types;

let id = () => types.ObjectId().toString();

exports.user1 = {
  username: "c-doug"
  , email: "cdiggy4sho@fakemail.com"
};

exports.user2 = {
  username: "spicy-p"
  , email: "royco_cubes@fakemail.com"
};

exports.user3 = {
  username: "crackhead-max"
  , email: "i_heart_crack@fakemail.com"
};

exports.user4 = {
  username: "jane-ho"
  , email: "will_suck_dick_for_money@fakemail.com"
};

Object.keys(exports).forEach(key => {
  exports[key]._id = id();
  exports[key].password = "test-password";
});