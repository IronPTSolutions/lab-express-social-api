const request = require("supertest");
const app = require("../src/app");

const USER = {
  name: "Alan Turing",
  username: "alan",
  email: "alan@example.com",
  password: "password123",
};

const POST_DATA = {
  title: "My First Post",
  body: "This is the body of my first post.",
};

let cookie;

beforeEach(async () => {
  await request(app).post("/api/v0/users").send(USER);
  const res = await request(app)
    .post("/api/v0/sessions")
    .send({ email: USER.email, password: USER.password });
  cookie = res.headers["set-cookie"];
});

describe("GET /api/v0/posts", () => {
  it("should return 401 without session", async () => {
    const res = await request(app).get("/api/v0/posts");
    expect(res.status).toBe(401);
  });

  it("should return an array of posts with populated authors", async () => {
    await request(app).post("/api/v0/posts").send(POST_DATA).set("Cookie", cookie);
    const res = await request(app).get("/api/v0/posts").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].author.username).toBe(USER.username);
  });
});

describe("POST /api/v0/posts", () => {
  it("should create a post and return 201 with populated author", async () => {
    const res = await request(app)
      .post("/api/v0/posts")
      .send(POST_DATA)
      .set("Cookie", cookie);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(POST_DATA.title);
    expect(res.body.author).toBeDefined();
    expect(res.body.author.username).toBe(USER.username);
  });
});

describe("GET /api/v0/posts/:id", () => {
  it("should return the post with author and comments array", async () => {
    const createRes = await request(app)
      .post("/api/v0/posts")
      .send(POST_DATA)
      .set("Cookie", cookie);
    const postId = createRes.body.id;

    const res = await request(app)
      .get(`/api/v0/posts/${postId}`)
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(postId);
    expect(res.body.author).toBeDefined();
    expect(Array.isArray(res.body.comments)).toBe(true);
  });
});

describe("PATCH /api/v0/posts/:id", () => {
  it("should update the post and return 200", async () => {
    const createRes = await request(app)
      .post("/api/v0/posts")
      .send(POST_DATA)
      .set("Cookie", cookie);
    const postId = createRes.body.id;

    const res = await request(app)
      .patch(`/api/v0/posts/${postId}`)
      .send({ title: "Updated Title" })
      .set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  it("should return 404 for a non-existent post id", async () => {
    const res = await request(app)
      .patch("/api/v0/posts/000000000000000000000000")
      .send({ title: "Updated Title" })
      .set("Cookie", cookie);
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/v0/posts/:id", () => {
  it("should delete the post and return 204", async () => {
    const createRes = await request(app)
      .post("/api/v0/posts")
      .send(POST_DATA)
      .set("Cookie", cookie);
    const postId = createRes.body.id;

    const res = await request(app)
      .delete(`/api/v0/posts/${postId}`)
      .set("Cookie", cookie);
    expect(res.status).toBe(204);
  });
});
