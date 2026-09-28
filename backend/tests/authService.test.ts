/// <reference types="jest" />

import bcrypt from 'bcrypt';
import { AuthService } from '../src/services/authService';
import { pool } from '../src/config/database';

// Mock del pool de Postgres
jest.mock('../src/config/database', () => ({
  pool: {
    query: jest.fn()
  }
}));

const mockQuery = pool.query as jest.Mock;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registrar', () => {
    const dtoBase = {
      nombre: 'Donante Test',
      email: 'donante@test.com',
      password: 'Password123',
      rol: 'usuario' as const,
      tipo: 'donante' as const
    };

    it('debe registrar un usuario correctamente', async () => {
      // 1ª llamada: SELECT (no existe)
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      // 2ª llamada: INSERT
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, nombre: 'Donante Test', email: 'donante@test.com', rol: 'usuario', tipo: 'donante' }]
      });

      const result = await AuthService.registrar(dtoBase);

      expect(result.id).toBe(1);
      expect(mockQuery).toHaveBeenCalledTimes(2);
      expect(mockQuery.mock.calls[0][0]).toContain('SELECT');
      expect(mockQuery.mock.calls[1][0]).toContain('INSERT');
    });

    it('debe lanzar EMAIL_DUPLICADO si ya existe', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

      await expect(AuthService.registrar(dtoBase)).rejects.toThrow('EMAIL_DUPLICADO');
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('debe hashear la contraseña antes de guardarla', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

      const spy = jest.spyOn(bcrypt, 'hash');

      await AuthService.registrar(dtoBase);

      expect(spy).toHaveBeenCalledWith('Password123', 10);
    });

    it('debe aceptar RFC y teléfono opcionales', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

      await AuthService.registrar({
        ...dtoBase,
        rfc: 'XAXX010101000',
        telefono: '8112345678'
      });

      const insertParams = mockQuery.mock.calls[1][1];
      expect(insertParams[5]).toBe('XAXX010101000');
      expect(insertParams[6]).toBe('8112345678');
    });

    it('debe usar null cuando RFC y teléfono están ausentes', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });
      mockQuery.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] });

      await AuthService.registrar(dtoBase);

      const insertParams = mockQuery.mock.calls[1][1];
      expect(insertParams[5]).toBeNull();
      expect(insertParams[6]).toBeNull();
    });
  });

  describe('login', () => {
    it('debe retornar token y usuario con credenciales válidas', async () => {
      const hash = await bcrypt.hash('Password123', 10);
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{
          id: 1,
          nombre: 'Test',
          email: 'test@test.com',
          password_hash: hash,
          rol: 'usuario',
          tipo: 'donante'
        }]
      });

      const result = await AuthService.login('test@test.com', 'Password123');

      expect(result.token).toBeDefined();
      expect(result.usuario.id).toBe(1);
      expect(result.usuario.email).toBe('test@test.com');
      expect(result.usuario.rol).toBe('usuario');
    });

    it('debe lanzar CREDENCIALES_INVALIDAS si no existe el email', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      await expect(AuthService.login('no@existe.com', 'Password123'))
        .rejects.toThrow('CREDENCIALES_INVALIDAS');
    });

    it('debe lanzar CREDENCIALES_INVALIDAS si la contraseña no coincide', async () => {
      const hash = await bcrypt.hash('OtraPassword', 10);
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{
          id: 1,
          nombre: 'Test',
          email: 'test@test.com',
          password_hash: hash,
          rol: 'usuario',
          tipo: 'donante'
        }]
      });

      await expect(AuthService.login('test@test.com', 'PasswordIncorrecta'))
        .rejects.toThrow('CREDENCIALES_INVALIDAS');
    });

    it('debe retornar rol administrador si corresponde', async () => {
      const hash = await bcrypt.hash('Password123', 10);
      mockQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{
          id: 2,
          nombre: 'Admin',
          email: 'admin@test.com',
          password_hash: hash,
          rol: 'administrador',
          tipo: 'donante'
        }]
      });

      const result = await AuthService.login('admin@test.com', 'Password123');
      expect(result.usuario.rol).toBe('administrador');
    });
  });
});