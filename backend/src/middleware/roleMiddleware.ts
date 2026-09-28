import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { Rol } from '../utils/jwt';

export const autorizar = (...roles: Rol[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
};