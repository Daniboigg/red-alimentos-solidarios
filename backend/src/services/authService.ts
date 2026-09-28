import bcrypt from 'bcrypt';
import { pool } from '../config/database';
import { generarToken, Rol } from '../utils/jwt';

export interface RegistroDTO {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  tipo: 'donante' | 'beneficiario';
  rfc?: string;
  telefono?: string;
}

export class AuthService {
  static async registrar(dto: RegistroDTO) {
    const existe = await pool.query('SELECT id FROM usuarios WHERE email=$1', [dto.email]);
    if (existe.rowCount && existe.rowCount > 0) {
      throw new Error('EMAIL_DUPLICADO');
    }

    const hash = await bcrypt.hash(dto.password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash, rol, tipo, rfc, telefono)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, nombre, email, rol, tipo, creado_en`,
      [dto.nombre, dto.email, hash, dto.rol, dto.tipo, dto.rfc || null, dto.telefono || null]
    );

    return result.rows[0];
  }

  static async login(email: string, password: string) {
    const result = await pool.query('SELECT * FROM usuarios WHERE email=$1', [email]);
    if (!result.rowCount || result.rowCount === 0) {
      throw new Error('CREDENCIALES_INVALIDAS');
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('CREDENCIALES_INVALIDAS');

    const token = generarToken({
      id: user.id,
      email: user.email,
      rol: user.rol as Rol
    });

    return {
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        tipo: user.tipo
      }
    };
  }
}