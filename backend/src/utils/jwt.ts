import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export type Rol = 'administrador' | 'usuario';

export interface JwtPayload {
  id: number;
  email: string;
  rol: Rol;
}

export const generarToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);
};

export const verificarToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};