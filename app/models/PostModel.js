/**
 * @author EmmanuelOlaojo
 * @since 10/25/17
 */

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let schema = {
  author: {type: Schema.Types.ObjectId, ref: "Users", required: true}
  , anon: Boolean
  , type: {type: String, required: true}
  , title: {type: String, required: true}
  , text: {type: String}
  , raw_text: {type: String}
  , link: {type: String}
};

let options = {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}};

let PostSchema = new Schema(schema, options);

exports.Posts = mongoose.model("Posts", PostSchema);