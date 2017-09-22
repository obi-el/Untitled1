/**
 * @author EmmanuelOlaojo
 * @since 7/13/17
 */

module.exports = {
  port: process.env.PORT || 8080
  , secret: 'issadatabase'
  , url: 'mongodb://localhost:27017/untitledDB'
  , MONGO_ERR: "MongoError"
  , DUP_ERR: 11000
  , authToken: "x-u_auth-token"
  , DEFAULT_ERR_MSG: "OOPS!! Sumfin goofed!!"
};