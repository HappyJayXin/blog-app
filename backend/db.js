const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URI;

let db;

async function connectDB() {
  if (db) return db;
  const client = new MongoClient(url);
  await client.connect();
  db = client.db();
  console.log('✅ Connected to MongoDB');
  return db;
}

module.exports = connectDB;