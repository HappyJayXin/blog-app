require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const postsRoute = require('./routes/posts');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/posts', postsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
