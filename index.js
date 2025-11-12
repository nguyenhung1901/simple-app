const express = require('express');
const cors = require('cors');
const {BlogPosts} = require('./BlogPosts');
const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res)=>{
  res.status(200).json("Server is running!");
});
app.post('/api/posts', (req, res) => {
  console.log('=== DEBUG POST REQUEST ===');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('========================');
  
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (BlogPosts.find(post => post.slug === slug)) {
    return res.status(400).json({ error: 'Post with this title already exists' });
  }
  
  const newPost = {
    slug,
    title,
    description
  };
  
  BlogPosts.push(newPost);
  res.status(201).json(newPost);
});
app.get('/api/posts/count',(req,res)=>{
  res.status(200).json({count: BlogPosts.length});
})
app.get('/api/posts/:slug',(req,res)=>{
  const slug = req.params.slug;
  const post = BlogPosts.find((p)=>p.slug==slug);
  if(post){
    res.status(200).json(post);
  } 
  else{
    res.status(404).json({msg:"Post not found."});
  }
});
app.get('/api/search', (req,res)=>{
  const query = req.query.q?req.query.q.toLocaleLowerCase():"";
  const result = BlogPosts.filter(
  (p)=>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  res.status(200).json(result);
})
const port = 3000;
app.listen(port,()=>{
  console.log(`Server is running http://localhost:${port}`);
})