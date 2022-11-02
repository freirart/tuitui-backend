const request = require("supertest");
const mongoose = require("../src/database");
const app = require("../src/app");
const factory = require("./factories");

beforeEach((done) => {
  mongoose.connection.dropCollection("users", () => {
    mongoose.connection.createCollection("users", () => done());
  });
});

describe.skip("User Sign Up flow", () => {
  it("should return an error when body request has no 'username' and/or 'password' fields.", async () => {
    const response = await request(app).post("/users/signup").send({
      noUsernameField: true,
      noPasswordField: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an error if signing in using a username that already belongs to an user.", async () => {
    const user = await factory.create("User");
    const response = await request(app)
      .post("/users/signup")
      .send({ username: user.username, password: user.password });

    expect(response.status).toBe(501);
    expect(response.body).toHaveProperty("error");
  });

  it("should register a new user when given its username and password.", async () => {
    const response = await request(app)
      .post("/users/signup")
      .send({ username: Date.now(), password: Date.now() });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });
});

describe.skip("User Sign In flow", () => {
  it("should return an error when body request has no 'username' and/or 'password' fields.", async () => {
    const response = await request(app).post("/users/signin").send({
      noUsernameField: true,
      noPasswordField: true,
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an error when trying to login as an user that doesn't exist.", async () => {
    const response = await request(app)
      .post("/users/signin")
      .send({ username: Date.now(), password: Date.now() });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an error when trying to login using an invalid password", async () => {
    const user = await factory.create("User");
    const response = await request(app)
      .post("/users/signin")
      .send({ username: user.username, password: Date.now().toString() });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should authenticate and return a token when given valid credentials", async () => {
    const password = Date.now().toString();
    const { username } = await factory.create("User", { password });
    const response = await request(app)
      .post("/users/signin")
      .send({ username, password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});

afterAll((done) => mongoose.connection.close(() => done()));
