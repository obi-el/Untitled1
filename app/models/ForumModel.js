/**
 * @author ObinnaElobi
 * @since 13/09/17
 */


let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let forumSchema = new Schema({
  topic: {type: String, required: true, unique: true}
  , mods : [{type: Schema.Types.ObjectId, required: true}]
  , subs : [{type: Schema.Types.ObjectId, required: true}]
});

exports.Forum = mongoose.model("Forum", forumSchema);