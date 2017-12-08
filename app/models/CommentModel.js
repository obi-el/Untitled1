/**
 * @author Obinna Elobi
 */

let Markdown = require("markdown-it");
let mdEmoji = require("markdown-it-emoji");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

/**
 * @todo Replies references, comment slugs, overview= https://docs.mongodb.com/ecosystem/use-cases/storing-comments/
 */
let CommentSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: "Users", required: true}
  , text: {type: String, required: true}
  , raw_text: {type: String, required: true}
  , createdAt: Date
  , updatedLast: Date
});

/**
 * @todo find more markdown plugins
 */
let md = new Markdown({linkify: true, breaks: true});
md.use(mdEmoji);
md.disable("image");


CommentSchema.pre("save", function(next){
  let comment = this;

  if(comment.isModified("raw_text")){
    comment.text = md.render(comment.raw_text);
    comment.text = comment.text.replace(/(?:\r\n|\r|\n)/g, '');
  }

  next();
});

exports.Comments = mongoose.model("Comments", CommentSchema);
