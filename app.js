const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const http = require('http');
const cors = require('cors');

const rotasFaturas = require('./src/app/routes/faturas');
const rotasUsuarios = require('./src/app/routes/users');

const corsConfig = require('./src/config/cors');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(corsConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', rotasUsuarios);
app.use('/faturas', rotasFaturas);

const port = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(port, console.log("Listening on port:", port));

