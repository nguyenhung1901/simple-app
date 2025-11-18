const mongoose = require("mongoose")

const BlogPostsSchema = new mongoose.Schema({
    slug: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true}
});
module.exports = mongoose.model("BlogPost", BlogPostsSchema);