const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

const DB = "mongodb://127.0.0.1/blog";
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Successfully connected to DB`))
  .catch((error) => console.error(`DB connection error: ${error}`));

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    index: true,
    unique: true
  },
  author: String,
  category: String
});

const Post = mongoose.model("Post", postSchema);

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send(`<p>Basic Api Rest</p>
    <ul>
      <li> All Posts - <a href="/api/posts">/api/posts</a></li>
      <li> Single Post : 1 - <a href="/api/post/64a944fe22f22fef562ffa07">/api/post/:id</a></li>
      <li> Single Post : 3 - <a href="/api/post/3">/api/post/:id</a></li>
    </ul>`);
});

app.get('/api', function(req, res) {
  res.send('Welcome to the api Rest');
});

app.get('/api/posts', function(req, res) {
    Post.find({})
        .then(posts => {
            res.status(200).send({
                response: posts
            });
        })
        .catch(error => {
            res.status(400).send({
                error: error.message
            });
        });
});

app.get('/api/post/:id', function(req, res) {
  const id = req.params.id;
  Post.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).send({ error: true, message: "Post not found" });
      } else {
        res.status(200).send({ response: post });
      }
    })
    .catch(error => {
      res.status(400).send({
        error: error.message
      });
    });
});

app.post('/api/post/add', function(req, res) {
  const post = new Post({
    title: "new post title",
    content: "this is a sample text for my first blog post.",
    createdAt: "Sat Jul 08 2023 11:41:03 GMT+0000",
    author: "by some author",
    category: "design"
  });

  const { body } = req;
  const newPost = new Post(body);

  newPost.save()
    .then(() => res.status(200).send('Post successfully added'))
    .catch((error) => res.status(400).send({ error: `Error adding new post: ${error.message}` }));
});
