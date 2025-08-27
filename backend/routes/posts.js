const express = require('express');
const router = express.Router();

const fakePosts = [
  { id: 1, title: '第一篇文章', content: '這是內容 A' },
  { id: 2, title: '第二篇文章', content: '這是內容 B' }
];

router.get('/', (req, res) => {
  res.json(fakePosts);
});

module.exports = router;