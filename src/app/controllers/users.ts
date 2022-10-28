import { Request, Response } from "express";

const { PROJECT_DOC } = process.env;

const User = require("../models/user");

const isThereAnyBodyParamUndefined = require("../utils");

exports.signUp = async (req: Request, res: Response) => {
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
        error: `No ${result.whichOne} provided.`,
        documentation: PROJECT_DOC
      });
    }

    const isExistingUser = await User.findOne({ userEmail }).exec();

    if (isExistingUser) {
      return res.status(400).json({
        error: "User already exists.",
        documentation: PROJECT_DOC
      });
    }

    const user = await User.create({ username, password, description, userEmail });

    req.userId = user._id;
    user.password = undefined;
    res.status(201).json({ user, token: user.generateToken(req.userId) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed." });
  }
};

exports.signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({ username, password });
    if (result.yes)
      return res.status(400).json({
        error: `No ${result.whichOne} provided.`,
        documentation: PROJECT_DOC
      });

    const user = await User.findOne({ username }).select("+password");
    if (!user)
      return res.status(401).json({
        error: "User does not exist.",
        documentation: PROJECT_DOC
      });

    if (!(await user.checkPassword(password)))
      return res.status(401).json({
        error: "Wrong password.",
        documentation: PROJECT_DOC
      });

    req.userId = user._id;
    res.status(200).json({ user, token: user.generateToken(req.userId) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't sign in." });
  }
};
