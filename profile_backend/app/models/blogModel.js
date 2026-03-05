const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BlogSchema = new schema(
  {
    blog_title: {
      type: String,
      required: true,
    },
    blog_content: {
      type: String,
      required: true,
    },
    blog_image: {
      type: String,
      required: true,
    },
    blog_author: {
      type: schema.Types.ObjectId,
      ref: "auth",
    },
  },
  { timestamps: true, versionkey: false },
);

const blogModel = mongoose.model("blogmodel", BlogSchema);

module.exports = blogModel;
