import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt';

export type RequestWithUserId<T> = T & { user_id?: string };

export const checkUserAuthorization = (
  req: RequestWithUserId<Request>,
  res: Response,
  next: NextFunction
) => {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, getJwtSecret()) as { user_id: string };

        req.user_id = decoded.user_id;
      } catch (error) {
        if(error instanceof Error) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
      }

      next();
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: 'Unauthorized' });
      }
      return;
    }
};
