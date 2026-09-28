import { Request, Response, NextFunction } from 'express';
import { verificarToken, JwtPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const autenticar = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const token = header.split(' ')[1];
    req.user = verificarToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};