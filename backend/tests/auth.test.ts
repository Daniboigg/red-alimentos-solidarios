/// <reference types="jest" />

import request from 'supertest';
import { app } from '../src/app';
import { AuthService } from '../src/services/authService';

jest.mock('../src/services/authService');

const mockRegistrar = AuthService.registrar as jest.Mock;
const mockLogin = AuthService.login as jest.Mock;

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/registro', () => {
    it('debe registrar un usuario válido y retornar 201', async () => {
      mockRegistrar.mockResolvedValue({
        id: 1,
        nombre: 'Donante Test',
        email: 'donante@test.com',
        rol: 'usuario',
        tipo: 'donante'
      });

      const res = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Donante Test',
          email: 'donante@test.com',
          password: 'Password123',
          tipo: 'donante'
        });

      expect(res.status).toBe(201);
      expect(res.body.usuario.email).toBe('donante@test.com');
      expect(res.body.mensaje).toContain('registrado');
    });

    it('debe rechazar email duplicado con 409', async () => {
      mockRegistrar.mockRejectedValue(new Error('EMAIL_DUPLICADO'));

      const res = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Otro User',
          email: 'duplicado@test.com',
          password: 'Password123',
          tipo: 'donante'
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('ya está registrado');
    });

    it('debe rechazar body inválido con 400', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send({ email: 'mal' });

      expect(res.status).toBe(400);
      expect(res.body.errores).toBeDefined();
    });

    it('debe rechazar contraseña corta con 400', async () => {
      const res = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Test User',
          email: 'test@test.com',
          password: '123',
          tipo: 'donante'
        });

      expect(res.status).toBe(400);
    });

    it('debe manejar error interno con 500', async () => {
      mockRegistrar.mockRejectedValue(new Error('OTRO_ERROR'));

      const res = await request(app)
        .post('/api/auth/registro')
        .send({
          nombre: 'Test User',
          email: 'test2@test.com',
          password: 'Password123',
          tipo: 'donante'
        });

      expect(res.status).toBe(500);
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe retornar token en login válido', async () => {
      mockLogin.mockResolvedValue({
        token: 'jwt.token.test',
        usuario: { id: 1, nombre: 'Test', email: 'test@test.com', rol: 'usuario', tipo: 'donante' }
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'Password123' });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.usuario).toBeDefined();
    });

    it('debe rechazar credenciales inválidas con 401', async () => {
      mockLogin.mockRejectedValue(new Error('CREDENCIALES_INVALIDAS'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });

      expect(res.status).toBe(401);
    });

    it('debe rechazar email inválido con 400', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'no-es-email', password: 'Password123' });

      expect(res.status).toBe(400);
    });

    it('debe manejar error interno con 500', async () => {
      mockLogin.mockRejectedValue(new Error('OTRO_ERROR'));

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'Password123' });

      expect(res.status).toBe(500);
    });
  });

  describe('GET /health', () => {
    it('debe retornar status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});