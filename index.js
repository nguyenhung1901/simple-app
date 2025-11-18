require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");
const Users = require("./models/Users");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Connection error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
app.post("/api/login", async(req,res)=>{
  const {username, password} = req.body;
  if(!username || !password){   // sửa lại username
    return res.status(400).json({msg:"Missing username or password"});
  }

  const user = await Users.findOne({username});
  if(!user){
    return res.status(401).json({msg:"User not found"});
  }
  if(user.password !== password){
    return res.status(401).json({msg:"Wrong password"});
  }

  res.status(200).json({
    msg:"Login successful",
    username: user.username,
    role: user.role
  })
})

app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Missing username or password" });
  }

  const existingUser = await Users.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ msg: "Username already exists" });
  }

  try {
    const newUser = await Users.create({ username, password });
    res.status(201).json({ msg: "User created", username: newUser.username, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

app.post("/api/posts", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const exists = await BlogPost.findOne({ slug });
    if (exists) {
      return res.status(400).json({ error: "A post with this title already exists" });
    }

    const newPost = await BlogPost.create({ slug, title, description });
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/posts", async (req, res) => {
  const posts = await BlogPost.find().select("slug title");
  res.json(posts);
});

app.get("/api/posts/count", async (req, res) => {
  const count = await BlogPost.countDocuments();
  res.json({ count });
});

app.get("/api/posts/:slug", async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (!post) {
    return res.status(404).json({ msg: "Post not found." });
  }
  res.json(post);
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q?.toLowerCase() || "";

  const result = await BlogPost.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
  });

  res.json(result);
});

const port = 3000;
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

// const cors = require('cors');
// const {BlogPosts} = require('./BlogPosts');
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.get('/', (req, res)=>{
//   res.status(200).json("Server is running!");
// });
// app.post('/api/posts', (req, res) => {
//   console.log('=== DEBUG POST REQUEST ===');
//   console.log('Headers:', req.headers);
//   console.log('Body:', req.body);
//   console.log('========================');
  
//   const { title, description } = req.body;
  
//   if (!title || !description) {
//     return res.status(400).json({ error: 'Title and description are required' });
//   }
  
//   const slug = title
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/(^-|-$)/g, '');

//   if (BlogPosts.find(post => post.slug === slug)) {
//     return res.status(400).json({ error: 'Post with this title already exists' });
//   }
  
//   const newPost = {
//     slug,
//     title,
//     description
//   };
  
//   BlogPosts.push(newPost);
//   res.status(201).json(newPost);
// });
// app.get('/api/posts/count',(req,res)=>{
//   res.status(200).json({count: BlogPosts.length});
// })
// app.get('/api/posts/:slug',(req,res)=>{
//   const slug = req.params.slug;
//   const post = BlogPosts.find((p)=>p.slug==slug);
//   if(post){
//     res.status(200).json(post);
//   } 
//   else{
//     res.status(404).json({msg:"Post not found."});
//   }
// });
// app.get('/api/search', (req,res)=>{
//   const query = req.query.q?req.query.q.toLocaleLowerCase():"";
//   const result = BlogPosts.filter(
//   (p)=>
//     p.title.toLowerCase().includes(query) ||
//     p.description.toLowerCase().includes(query)
//   );
//   res.status(200).json(result);
// })
// const port = 3000;
// app.listen(port,()=>{
//   console.log(`Server is running http://localhost:${port}`);
// })

