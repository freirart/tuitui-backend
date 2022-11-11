require("dotenv").config({
  path: process.env.NODE_ENV === "TEST" ? ".env.test" : ".env"
});

import { json, urlencoded } from "body-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import usersRoutes from "./app/routes/users";

const corsConfig = require("./config/cors");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(corsConfig);

app.use(json());
app.use(urlencoded({ extended: true }));

app.use("/users", usersRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ 
    error: "Invalid endpoint.",
    documentation: "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md"
  });
});

module.exports = app;

