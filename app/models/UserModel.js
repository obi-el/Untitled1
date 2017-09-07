/*jshint esversion: 6 */

let bcrypt = require('bcrypt');
let validator = require("validator");
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const SALT_ROUNDS = 10;


let userSchema = new Schema({
  username: {type: String, required: true, unique: true, minlength: 2, maxlength: 15}
  , email: {type: String, required: true
    , validate: {
      isAsync: false
      , validator: validator.isEmail
      , message: "Invalid email"
    }
  }
  , password: {type: String, required: true, minlength: 6, select: false}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password){
  return bcrypt.hash(password, SALT_ROUNDS);
};

// checking if password is the same
userSchema.methods.validPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

//hash password before each save
userSchema.pre('save', async function (next) {
  let user = this;

  try {

    if (user.isModified('password')) {
      user.password = await this.generateHash(user.password);
    }

    next();
  }
  catch(err){
    next(err);
  }
});

exports.User = mongoose.model('User', userSchema);