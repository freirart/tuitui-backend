const request = require('supertest');
const factory = require('./factories');
const faker = require('faker');
const mongoose = require('../src/database');
const app = require('../src/app');

const username = faker.internet.userName();
const password = faker.internet.password();

describe('User Sign Up flow', () => {
  afterAll(done => {
    mongoose.connection.close();
    done();
  });
  afterEach(done => done());

  it("should return an error when body request has no 'username' and/or 'password' fields ",
    async (done) => {
      const response = await request(app)
        .post('/users/signup')
        .send({
          noUsernameField: true,
          noPasswordField: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      done();
  });

  it("should return an error if entered username already belongs to an existing user",
    async (done) => {
      const user = await factory.create('User');
      const response = await request(app)
        .post('/users/signup')
        .send({ username: user.username, password: user.password });

      expect(response.status).toBe(501);
      expect(response.body).toHaveProperty('error');
      done();
  });

  it("should register a new user when given its username and password",
    async (done) => {
      const response = await request(app)
        .post('/users/signup')
        .send({ username, password });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      done();
  });
});

export {}