import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';

const registroSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  rol: z.enum(['administrador', 'usuario']).optional().default('usuario'),
  tipo: z.enum(['donante', 'beneficiario']),
  rfc: z.string().optional(),
  telefono: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

export const registrar = async (req: Request, res: Response) => {
  const parsed = registroSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errores: parsed.error.issues });
  }

  try {
    const usuario = await AuthService.registrar(parsed.data);
    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario
    });
  } catch (e: any) {
    if (e.message === 'EMAIL_DUPLICADO') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    console.error('Error en registro:', e);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errores: parsed.error.issues });
  }

  try {
    const data = await AuthService.login(parsed.data.email, parsed.data.password);
    return res.json(data);
  } catch (e: any) {
    if (e.message === 'CREDENCIALES_INVALIDAS') {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    console.error('Error en login:', e);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};