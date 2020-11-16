import { Request, Response, NextFunction } from 'express';

const User = require('../models/user');

const isThereAnyBodyParamUndefined = require('../utils');

exports.signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({ username, password });
    if (result.yes) 
      return res.status(400).json({ error: `No ${result.whichOne} provided.` });

    const isExistingUser = await User.findOne({ username }).exec();
    if (isExistingUser)
      return res.status(501).json({ error: 'User already exists.' });

    const user = await User.create({ username, password });

    req.userId = user._id;
    user.password = undefined;
    res.status(201).json({ user, token: user.generateToken(req.userId) });
  } catch (err) {
    console.log(err);
    res.status(501).json({ error: 'Registration failed.' });
  }
};

exports.signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  try {
    const result = isThereAnyBodyParamUndefined({ username, password });
    if (result.yes) 
      return res.status(400).json({ error: `No ${result.whichOne} provided.` });

    const user = await User.findOne({ username }).select('+password');
    if (!user)
      return res.status(401).json({ error: 'User does not exist.' });

    if (!(await user.checkPassword(password)))
      return res.status(401).json({ error: 'Wrong password.' });

    req.userId = user._id;
    res.status(200).json({ user, token: user.generateToken(req.userId) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldn't sign in." });
  }
};