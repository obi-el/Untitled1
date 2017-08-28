/*jshint esversion: 6 */

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;
const saltrounds = 10;


let userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true }, unique: true },
    password: { type: String, required: true }
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password){
    return bcrypt.hash(password, saltrounds);
};

// checking if password is the same
userSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

//hash password before each save
userSchema.pre('save', async function (next) {
    let user = this;
    if (!user.isModified('password')) return next();
    user.password = await this.generateHash(user.password);
    next();
});

module.exports = mongoose.model('User', userSchema);