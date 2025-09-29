const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { Image, Comment } = require("../models");

const uploadDir = path.join(__dirname, "..", "public", "upload");
const tempDir = path.join(uploadDir, "temp");
const fixturesDir = path.join(__dirname, "fixtures");
const seedImageName = "seed-image.png";
const uploadFixtureName = "upload-image.png";
const imageBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
  "base64"
);

let mongoServer;

const ensureDirs = () => {
  [uploadDir, tempDir, fixturesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

const ensureFixtureFiles = () => {
  const seedImagePath = path.join(uploadDir, seedImageName);
  if (!fs.existsSync(seedImagePath)) {
    fs.writeFileSync(seedImagePath, imageBuffer);
  }
  const uploadFixturePath = path.join(fixturesDir, uploadFixtureName);
  if (!fs.existsSync(uploadFixturePath)) {
    fs.writeFileSync(uploadFixturePath, imageBuffer);
  }
};

const seedDatabase = async () => {
  const image = await Image.create({
    uniqueId: "testimage",
    title: "晨霧山林",
    description: "清晨的薄霧包圍山林，靜謐而迷人。",
    filename: seedImageName,
    views: 134,
    likes: 18,
    timestamp: new Date("2023-11-28T06:30:00Z")
  });
  await Comment.create({
    image_id: image._id,
    email: "lina@example.com",
    name: "Lina",
    comment: "喜歡這張照片的光線。",
    timestamp: new Date("2023-11-29T08:15:00Z")
  });
  await Comment.create({
    image_id: image._id,
    email: "ken@example.com",
    name: "Ken",
    comment: "有種親臨現場的感覺。",
    timestamp: new Date("2023-11-30T11:42:00Z")
  });
  global.__TEST_IMAGE_ID__ = image.uniqueId;
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  ensureDirs();
  ensureFixtureFiles();
  await seedDatabase();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  await seedDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

module.exports = {};
