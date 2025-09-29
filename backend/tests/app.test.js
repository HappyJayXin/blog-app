const path = require("path");
const request = require("supertest");
const app = require("../app");
const { Image } = require("../models");

describe("image routes", () => {
  let imageId;

  beforeEach(() => {
    imageId = global.__TEST_IMAGE_ID__;
  });

  it("should return image homepage", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("探索最新圖片");
  });

  it("should render image detail page", async () => {
    const res = await request(app).get(`/images/${imageId}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("晨霧山林");
  });

  it("should handle like action", async () => {
    const res = await request(app)
      .post(`/images/${imageId}/like`)
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.likes).toBe("number");
  });

  it("should upload a new image", async () => {
    const uploadPath = path.join(__dirname, "fixtures", "upload-image.png");
    const res = await request(app)
      .post("/images")
      .field("title", "海邊日落")
      .field("description", "日落時分的海邊")
      .attach("image", uploadPath);
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toMatch(/^\/images\//);
    const newId = res.headers.location.split("/").pop();
    const image = await Image.findOne({ uniqueId: newId });
    expect(image).not.toBeNull();
    expect(image.title).toBe("海邊日落");
  });
});
