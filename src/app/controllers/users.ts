import { Request, Response } from "express";
import { UserModel } from "../models/user";

const { PROJECT_DOC } = process.env;

import { isThereAnyBodyParamUndefined } from "../utils";

export const signUp = async (req: Request, res: Response) => {
  const { username, password, description, userEmail } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({
      username,
      password,
      description,
      userEmail,
    });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
        documentation: PROJECT_DOC,
      });
    }

    const isExistingUser = await UserModel.findOne({ userEmail }).exec();

    if (isExistingUser) {
      return res.status(400).json({
        message: "User already exists.",
        documentation: PROJECT_DOC,
      });
    }

    const user = await UserModel.create({
      username,
      password,
      description,
      userEmail,
    });

    user.save();

    req.userId = user._id;
    res
      .status(201)
      .json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed." });
  }

  return res;
};

export const signIn = async (req: Request, res: Response) => {
  const { userEmail, password } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({ userEmail, password });

    if (result.yes) {
      return res.status(400).json({
        message: `No '${result.whichOne}' provided.`,
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
    res
      .status(200)
      .json({ user: user.getDocument(), token: user.generateToken() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Couldn't sign in." });
  }

  return res;
};
