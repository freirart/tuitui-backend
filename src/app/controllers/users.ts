import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user";
import { validateParams } from "../utils";

const { PROJECT_DOC } = process.env;

/**
 * Middleware global para tratamento de erros.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
};

/**
 * Cria um novo usuário.
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, description, userEmail } = req.body;

  try {
    const validationResult = validateParams({ username, password, description, userEmail });

    if (validationResult.yes) {
      return res.status(400).json({
        message: `No '${validationResult.message}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const existingUser = await UserModel.findOne({ userEmail }).exec();

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
        documentation: PROJECT_DOC,
      });
    }

    const user = await UserModel.create({ username, password, description, userEmail });
    user.save();

    req.userId = user._id;
    res.status(201).json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    next(err);
  }
};

/**
 * Realiza o login do usuário.
 */
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail, password } = req.body;

  try {
    const validationResult = validateParams({ userEmail, password });

    if (validationResult.yes) {
      return res.status(400).json({
        message: `No '${validationResult.message}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const user = await UserModel.findOne({ userEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "User does not exist.",
        documentation: PROJECT_DOC,
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        message: "Wrong password.",
        documentation: PROJECT_DOC,
      });
    }

    req.userId = user._id;
    res.status(200).json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const existingUser = await UserModel.findById(userId);

    if (existingUser && !existingUser.isDeleted) {
      existingUser.isDeleted = true;
      await existingUser.save();

      return res.status(200).json({ message: "Successfully deleted." });
    }

    return res.status(401).json({ message: "Can't delete this user." });
  } catch (err) {
    next(err);
  }
};

export const edit = async (req: Request, res: Response) => {
  const { userId } = req;

  try {
    const existingUser = await UserModel.findById(userId);

    const expectedKeys = ["username", "description"];
    for (const key of expectedKeys) {
      if (key in req.body) {
        existingUser[key] = req.body[key];
      }
    }

    const updatedUser = await existingUser.save();
    return res.status(200).json({ updatedUser: updatedUser.getDocument() });
  } catch (err) {
    next(err);
  }
};

export const search = async (req: Request, res: Response) => {
  const { username, userEmail } = req.query;

  try {
    const validationResult = validateParams({ username, userEmail });

    if (validationResult.yes) {
      return res.status(400).json({
        message: `No '${validationResult.message}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const andFilter = [].push({ isDeleted: { $ne: true } }) as any;

    if (username) {
      andFilter.push({ username: { $regex: username, $options: "i" } });
    }

    if (userEmail) {
      andFilter.push({ userEmail });
    }

    const data = await UserModel.find({ $and: andFilter });

    return res.status(200).json({
      users: data.map((user) => user.getDocument()),
      count: data.length,
    });
  } catch (err) {
    next(err);
  }
};

