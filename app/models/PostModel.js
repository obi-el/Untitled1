/**
 * @author EmmanuelOlaojo
 * @since 10/25/17
 */

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let PostSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: "Users", required: true}
  , anon: Boolean
  , type: {type: String, required: true}
  , title: {type: String, required: true}
  , text: {type: String, required: true}
  , raw_text: {type: String, required: true}
  , link: {type: String, required: true}
  , timestamps: {createdAt: "created_at", updatedAt: "updated_at"}
});

exports.Posts = mongoose.model("Posts", PostSchema);