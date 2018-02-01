/**
 * @author Obinna Elobi
 * @since 8/30/17
 */

let bcrypt = require("bcrypt");
let validator = require("validator");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let config = require("../../config");

const SALT_ROUNDS = 10;

let userSchema = new Schema({
  alias: {type: String, required: true, unique: true, minlength: 2, maxlength: 20}
  , email: {type: String, required: true, unique: true
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
userSchema.pre("save", async function (next) {
  let user = this;

  try {
    if (user.isModified("password")) {
      user.password = await this.generateHash(user.password);
    }

    next();
  }
  catch(err){
    next(err);
  }
});

userSchema.post("save", async function (err, doc, next) {
  if(!(err.name === config.MONGO_ERR && err.code === config.DUP_ERR))
    return next(err);

  let User = this.constructor;
  let field;

  let user = await User.findOne({email: doc.email}).exec();

  if(user && user._id !== doc._id) field = "email";
  else field = "alias";

  next(new Error(`Sorry, the given ${field} has been taken`));
});

exports.Users = mongoose.model("Users", userSchema);