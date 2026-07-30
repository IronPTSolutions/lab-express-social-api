const request = require("supertest");
const app = require("../src/app");

const USER = {
  name: "Ada Lovelace",
  username: "ada",
  email: "ada@example.com",
  password: "password123",
};

let cookie;

beforeEach(async () => {
  await request(app).post("/api/v0/users").send(USER);
  const res = await request(app)
    .post("/api/v0/sessions")
    .send({ email: USER.email, password: USER.password });
  cookie = res.headers["set-cookie"];
});

describe("POST /api/v0/users", () => {
  it("should create a user and return 201", async () => {
    const newUser = {
      name: "Grace Hopper",
      username: "grace",
      email: "grace@example.com",
      password: "password123",
    };
    const res = await request(app).post("/api/v0/users").send(newUser);
    expect(res.status).toBe(201);
    expect(res.body.username).toBe("grace");
    expect(res.body.password).toBeUndefined();
  });

  it("should return 409 for duplicate username", async () => {
    const res = await request(app).post("/api/v0/users").send(USER);
    expect(res.status).toBe(409);
  });
});

describe("POST /api/v0/sessions", () => {
  it("should login with valid credentials and return 200", async () => {
    const res = await request(app)
      .post("/api/v0/sessions")
      .send({ email: USER.email, password: USER.password });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(USER.username);
    expect(res.body.password).toBeUndefined();
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/v0/sessions")
      .send({ email: USER.email, password: "wrongpassword" });
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/v0/sessions", () => {
  it("should logout and return 204", async () => {
    const res = await request(app).delete("/api/v0/sessions").set("Cookie", cookie);
    expect(res.status).toBe(204);
  });
});

describe("GET /api/v0/users/me", () => {
  it("should return 401 without session", async () => {
    const res = await request(app).get("/api/v0/users/me");
    expect(res.status).toBe(401);
  });

  it("should return the logged-in user with posts array", async () => {
    const res = await request(app).get("/api/v0/users/me").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.username).toBe(USER.username);
    expect(res.body.password).toBeUndefined();
    expect(Array.isArray(res.body.posts)).toBe(true);
  });
});
