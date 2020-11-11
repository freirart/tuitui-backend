const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) 
    return res.status(401).json({ error: 'No token provided.' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) 
    return res.status(401).json({ error: 'Invalid token: unknown token format.' });

  const [ scheme, token ] = parts;
  if (!/^Bearer$/i.test(scheme)) 
    return res.status(401).json({ error: "Invalid token: no 'Bearer' provided." });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token.' });
    
    req.userId = decoded.id;
    return next();
  });
};

module.exports = validateToken;