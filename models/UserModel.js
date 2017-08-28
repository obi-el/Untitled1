/*jshint esversion: 6 */

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema = mongoose.Schema;
const saltrounds = 10;


var userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true }, unique: true },
    password: { type: String, required: true }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password){
    bcrypt.hash(password, saltrounds, function (err, res) {
        if(err)throw err;
        else return res;
    });
};

// checking if password is the same
userSchema.methods.validPassword = function(password) {
    return bcrypt.compare(password, this.password ,function (err,res) {
        if(err)throw err;
        else return res;
    });
};

//hash password before each save
userSchema.pre('save', function (next) {
    let user = this;
    if (!user.isModified('password')) return next();
    user.password = this.generateHash(user.password);
    next();
});

module.exports = mongoose.model('User', userSchema);