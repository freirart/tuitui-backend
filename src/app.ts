require("dotenv").config({
  path: process.env.NODE_ENV === "TEST" ? ".env.test" : ".env",
});

import express, { Request, Response } from "express";
import cors from "cors";

import usersRoutes from "./app/routes/users";
import tagsRoutes from "./app/routes/tags";
import articlesRoutes from "./app/routes/articles";

const corsConfig = require("./config/cors");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(corsConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRoutes);
app.use("/tags", tagsRoutes);
app.use("/articles", articlesRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: "Invalid endpoint.",
    documentation:
      "https://github.com/freirart/desafio-tecnico-music-playce/blob/main/public/docs.md",
  });
});

export default app;
