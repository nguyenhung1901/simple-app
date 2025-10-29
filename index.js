// index.js
const express = require("express");
const cors = require("cors");
const { BlogPosts } = require("./BlogPosts");

const app = express();
app.use(cors());
app.use(express.json()); 

app.get("/api/posts", (req, res) => {
  res.status(200).json(BlogPosts);
});

app.get("/api/post/:slug", (req, res) => {
  const slug = req.params.slug;
  const post = BlogPosts.find((p) => p.slug === slug);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});