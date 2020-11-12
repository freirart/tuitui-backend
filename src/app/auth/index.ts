import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface User {
  id?: string;
}

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) 
    return res.status(401).json({ error: 'No token provided.' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2) 
    return res.status(401).json({ error: 'Invalid token: unknown token format.' });

  const [ scheme, token ] = parts;
  if (!/^Bearer$/i.test(scheme)) 
    return res.status(401).json({ error: "Invalid token: no 'Bearer' provided." });

  jwt.verify(token, process.env.SECRET_KEY as jwt.Secret, (err, decoded?: User) => {
    if (err) return res.status(401).json({ error: 'Invalid token.' });
    
    req.userId = decoded?.id;
    return next();
  });
};

module.exports = validateToken;