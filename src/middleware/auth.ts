import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication invalid' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your_jwt_secret_key'
      ) as JwtPayload;
      
      // Add user info to request
      (req as any).user = { userId: decoded.userId };
      next();
    } catch (error) {
      res.status(401).json({ success: false, message: 'Authentication invalid' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}; 