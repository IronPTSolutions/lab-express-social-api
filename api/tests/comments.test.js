const request = require("supertest");
const app = require("../src/app");

const USER = {
  name: "Linus Torvalds",
  username: "linus",
  email: "linus@example.com",
  password: "password123",
};

const POST_DATA = {
  title: "Open Source Post",
  body: "A post about open source software.",
};

let cookie;
let postId;

beforeEach(async () => {
  await request(app).post("/api/v0/users").send(USER);
  const loginRes = await request(app)
    .post("/api/v0/sessions")
    .send({ email: USER.email, password: USER.password });
  cookie = loginRes.headers["set-cookie"];

  const postRes = await request(app)
    .post("/api/v0/posts")
    .send(POST_DATA)
    .set("Cookie", cookie);
  postId = postRes.body.id;
});

describe("POST /api/v0/posts/:id/comments", () => {
  it("should create a comment and return 201", async () => {
    const res = await request(app)
      .post(`/api/v0/posts/${postId}/comments`)
      .send({ body: "Great post!" })
      .set("Cookie", cookie);
    expect(res.status).toBe(201);
    expect(res.body.body).toBe("Great post!");
  });
});

describe("DELETE /api/v0/posts/:id/comments/:commentId", () => {
  it("should delete a comment and return 204", async () => {
    const createRes = await request(app)
      .post(`/api/v0/posts/${postId}/comments`)
      .send({ body: "Comment to delete" })
      .set("Cookie", cookie);
    const commentId = createRes.body.id;

    const res = await request(app)
      .delete(`/api/v0/posts/${postId}/comments/${commentId}`)
      .set("Cookie", cookie);
    expect(res.status).toBe(204);
  });

  it("should return 404 for a non-existent comment", async () => {
    const res = await request(app)
      .delete(`/api/v0/posts/${postId}/comments/000000000000000000000000`)
      .set("Cookie", cookie);
    expect(res.status).toBe(404);
  });
});
