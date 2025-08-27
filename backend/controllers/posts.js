const Post = require('../models/Post');

exports.list = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.render('posts', { title: '文章列表', posts });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.create({ title, content });
    res.redirect('/posts');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

