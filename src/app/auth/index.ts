import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UserModel } from "../models/user";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided." });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res
      .status(401)
      .json({ error: "Invalid token: unknown token format." });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(401)
      .json({ error: "Invalid token: no 'Bearer' provided." });
  }

  jwt.verify(
    token,
    process.env.SECRET_KEY as jwt.Secret,
    async (err, decoded?: { id: string }) => {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: "Token expired" });
      }

      const user = await UserModel.findById(decoded?.id).exec();

      if (!user || err) {
        return res.status(401).json({ error: "Invalid token." });
      }

      req.userId = user._id;
      next();
    }
  );
};
