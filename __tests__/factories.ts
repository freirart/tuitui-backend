const faker = require('faker');
const { factory } = require('factory-girl');
const User = require('../src/app/models/user');

factory.define("User", User, {
  username: faker.internet.userName(),
  password: faker.internet.password(),
});

module.exports = factory;

export {}