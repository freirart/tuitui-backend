// const request = require('supertest');
// const app = require('../src/app');
// const factories = require('./factories');
// const mongoose = require('../src/database');

// beforeAll(done => {
//   mongoose.connection.dropDatabase(() => done());
// });

// afterEach(done => {
//   mongoose.connection.dropCollection('users', () => {
//     mongoose.connection.createCollection('users', () => done());
//   });
// });

// describe("Authorization accessing private routes", () => {
//   it("should return an error if request header has no authorization token", async () => {
//     const response = await request(app).get('/faturas/');

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return an error if authorization header has an unknown format", async () => {
//     const response = await request(app)
//       .get('/faturas/')
//       .set('Authorization', Date.now().toString());

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return an error if authorization header doesn't have 'Bearer' in it", async () => {
//     const response = await request(app)
//       .get('/faturas/')
//       .set('Authorization', `${Date.now()} ${Date.now()}`);

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return an error if authorization token is not associated to user", async () => {
//     const response = await request(app)
//       .get('/faturas/')
//       .set('Authorization', `Bearer ${Date.now()}`);

//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should be able to access private routes when valid jwt token is provided", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .get('/faturas/pagination/0')
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBeLessThanOrEqual(204);
//   });
// });

// describe("POST /faturas", () => {
//   it("should return an error if invalid (falsy) values are passed", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ name: undefined, services: [], validade: null });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return en error if any of services' objects doesn't doesn't follow the pattern { name: <string>, value: <number> }",
//    async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ 
//         name: Date.now().toString(),
//         services: [
//           { doesItFollowThePattern: false, willItFail: true },
//           { name: Date.now().toString(), value: Date.now() }
//         ], 
//         validade: new Date().toLocaleDateString()
//       });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return en error if validade doesn't follow the pattern 'yyyy/mm/dd'",
//    async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ 
//         name: Date.now().toString(),
//         services: [
//           { name: Date.now().toString(), value: Date.now() }
//         ], 
//         validade: 'API REST CONTROLE FINANCEIRO - ARTUR FREIRE DOS SANTOS - MUSICPLAYCE'
//       });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return fatura when created", async () => {
//     const user = await factories.create('User');
//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ 
//         name: Date.now().toString(),
//         services: [
//           { name: Date.now().toString(), value: Date.now() }
//         ], 
//         validade: new Date().toLocaleDateString()
//       });
    
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty('fatura');
//   });

// });

// describe("GET /faturas/:faturaId", () => {
//   it("should return an error if 'faturaId' param is invalid", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .get('/faturas/:faturaId')
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return an error if 'faturaId' doesn't match any fatura", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .get(`/faturas/${mongoose.Types.ObjectId(Date.now())}`)
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return a fatura by its id", async () => {
//     const user = await factories.create('User');
//     const fatura = await factories.create('Fatura', { user: user._id });
    
//     const response = await request(app)
//       .get(`/faturas/${fatura._id}`)
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('fatura');
//   });
// });

// describe("DELETE /faturas/:faturaId", () => {
//   it("should return an error if 'faturaId' param is invalid", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .get('/faturas/:faturaId')
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return an error if 'faturaId' doesn't match any fatura", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .get(`/faturas/${mongoose.Types.ObjectId(Date.now())}`)
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should delete a fatura by its id", async () => {
//     const user = await factories.create('User');
//     const fatura = await factories.create('Fatura', { user: user._id });
    
//     const response = await request(app)
//       .delete(`/faturas/${fatura._id}`)
//       .set('Authorization', `Bearer ${user.generateToken()}`);

//     expect(response.status).toBe(200);
//     expect(response.body.method).toBe('DELETE');
//     expect(response.body.status).toBe('Success!');
//   });
// });

// describe("GET /faturas/pagination/:pageNumber", () => {
//   it("should return 204 when there were no faturas, either in the current page or in the whole collection",
//    async () => {
//     const user = await factories.create('User');
  
//     const response = await request(app)
//       .get('/faturas/pagination/0')
//       .set('Authorization', `Bearer ${user.generateToken()}`);
  
//     expect(response.status).toBe(204);
//   });

//   it("should return a list of the first twenty existing faturas when requesting the page 0 or omiting the page number parameter",
//    async () => {
//     const user = await factories.create('User');
//     await factories.create('Fatura', { user: user._id });

//     const response = await request(app)
//       .get('/faturas/pagination/')
//       .set('Authorization', `Bearer ${user.generateToken()}`);
    
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('listaFaturas');
//   });
// });

// describe("PUT /faturas", () => {
//   it("should return an error if invalid (falsy) values are passed", async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ _id: '', name: undefined, services: [], validade: null });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return en error if any of services' objects doesn't doesn't follow the pattern { name: <string>, value: <number> }",
//    async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ 
//         name: Date.now().toString(),
//         services: [
//           { doesItFollowThePattern: false, willItFail: true },
//           { name: Date.now().toString(), value: Date.now() }
//         ], 
//         validade: new Date().toLocaleDateString()
//       });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return en error if validade doesn't follow the pattern 'yyyy/mm/dd'",
//    async () => {
//     const user = await factories.create('User');

//     const response = await request(app)
//       .post('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({ 
//         name: Date.now().toString(),
//         services: [
//           { name: Date.now().toString(), value: Date.now() }
//         ], 
//         validade: 'API REST CONTROLE FINANCEIRO - ARTUR FREIRE DOS SANTOS - MUSICPLAYCE'
//       });
    
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty('error');
//   });

//   it("should return updated fatura when successful", async () => {
//     const user = await factories.create('User');
//     const fatura = await factories.create('Fatura', { user: user._id });
//     const response = await request(app)
//       .put('/faturas')
//       .set('Authorization', `Bearer ${user.generateToken()}`)
//       .send({
//         _id: fatura._id,
//         name: Date.now().toString(),
//         services: [
//           { name: Date.now().toString() + '(1)*', value: Date.now() },
//           { name: Date.now().toString() + '(2)*', value: Date.now() }
//         ], 
//         validade: new Date().toLocaleDateString(),
//         paid: true
//       });
    
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('updatedFatura');
//   });
// });

// afterAll(done => {
//   mongoose.connection.dropDatabase(() => {
//     mongoose.connection.close(() => done());
//   });
// });
