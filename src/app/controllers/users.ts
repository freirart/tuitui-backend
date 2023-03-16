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
    validateParams({ username, password, description, userEmail });
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
    validateParams({ userEmail, password });
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
      existingUser.save();

      return res.status(200).json({ message: "Successfully deleted." });
    }

    return res.status(401).json({ message: "Can't delete this user." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
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
    console.error(err);
    return res.status(500).json({ message: "Something went wrong!" });
  }
};

export const search = async (req: Request, res: Response) => {
  const { username, userEmail } = req.query;

  try {
    const result = areAllExpectedParamsUndefined({
      username, userEmail
    });

    if (result.yes) {
      return res.status(400).json({
        message: result.message,
        documentation: PROJECT_DOC,
      });
    }

    const andFilter = [];

    if (username) {
      andFilter.push({ username: new RegExp(username as string, "ig") });
    }

    if (userEmail) {
      andFilter.push({ userEmail });
    }

    // there are no reasons to show deleted users
    andFilter.push({ isDeleted: { $ne: true } });

    const data = await UserModel.find({ $and: andFilter });

    return res.status(200).json({ data: data.map((d) => d.getDocument()) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong." });
  }

  return res;
};

