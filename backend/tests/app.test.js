const request = require("supertest");
const app = require("../app");

describe("image routes", () => {
  it("should return image homepage", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("探索最新圖片");
  });

  it("should render image detail page", async () => {
    const res = await request(app).get("/images/1");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("晨霧山林");
  });

  it("should handle like action", async () => {
    const res = await request(app).post("/images/1/like").set("Accept", "application/json");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.likes).toBe("number");
  });
});
