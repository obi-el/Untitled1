/**
 * @author EmmanuelOlaojo
 * @since 10/25/17
 */

let Markdown = require("markdown-it");
let mdEmoji = require("markdown-it-emoji");
let mongoose = require("mongoose");
let validator = require("validator");
let Schema = mongoose.Schema;

let schema = {
  author: {type: Schema.Types.ObjectId, ref: "Users", required: true}
  , anon: {type: Boolean, default: false}
  , type: {type: String, required: true} // "text" "image" "video" "link"
  , title: {type: String, required: true}
  , text: String
  , raw_text: String
  , link: {
      title: String
    , description: String
    , image: String
    , url: {
      type: String
      , validator: [validator.isURL, "Invalid Url: `{VALUE}`"]
    }
  }
  , image: {data: String, mimetype: String}
  , video: {}
};
let options = {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}};
let PostSchema = new Schema(schema, options);

let md = new Markdown({linkify: true, breaks: true});
md.use(mdEmoji);
md.disable("image");

PostSchema.pre("save", function(next){
  let post = this;

  if(post.isModified("raw_text")){
    post.text = md.render(post.raw_text);
    post.text = post.text.replace(/(?:\r\n|\r|\n)/g, '');
  }

  next();
});

exports.Posts = mongoose.model("Posts", PostSchema);
