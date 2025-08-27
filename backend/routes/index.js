const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Blog App', message: '歡迎來到我的 Blog!' });
});

module.exports = router;

