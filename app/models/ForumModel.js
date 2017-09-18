/**
 * @author ObinnaElobi
 * @since 13/09/17
 */


let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let forumSchema = new Schema({
  topic: {type: String, required: true, unique: true}
  , mods : [{type: String, required: true}]
  , subs : [{type: String, required: true}]
});

exports.Forum = mongoose.model('Forum', forumSchema);