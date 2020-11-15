import { Request, Response, NextFunction } from 'express';
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const rotasFaturas = require('./app/routes/faturas');
const rotasUsuarios = require('./app/routes/users');

const corsConfig = require('./config/cors');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(corsConfig);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', rotasUsuarios);
app.use('/faturas', rotasFaturas);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ 
    error: 'Invalid endpoint.',
    documentation: 'https://www.github.com/freirart/desafio-tecnico-music-playce'
  });
});

module.exports = app;

