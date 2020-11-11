const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

function generateToken(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 86400,
  });
}

exports.signUp = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const isExistingUser = await User.findOne({ username });
    if (isExistingUser)
      return res.status(501).json({ error: 'User already exists.' });

    const user = await User.create({ username, password });

    req.userId = generateToken(user._id);
    user.password = undefined;
    res.status(201).json({ user, token: req.userId });

  } catch (err) {
    console.log(err);
    res.status(501).json({ error: 'Registration failed.' });
  }
};

exports.signIn = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');

  if (!user)
    return res.status(401).json({ error: 'User does not exist.' });

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return res.status(401).json({ error: 'Wrong password.' });

  const token = generateToken(user._id);

  req.userId = token;
  return res.status(200).json({ user, token });
};

exports.fetchByPageNumber = async (req, res, next) => {
  res.status(200).json({ message: 'Entrou com um token válido!' });
}