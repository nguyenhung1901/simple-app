const express = require('express');
const cors = require('cors');
const {BlogPosts} = require('./BlogPosts');
const app = express();
app.use(cors());

app.get('/', (req, res)=>{
  res.status(200).json("Server is running!");
});
app.get('/api/posts',(req,res)=>{
  res.status(200).json(BlogPosts);
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