/// <reference types="jest" />

import { generarToken, verificarToken } from '../src/utils/jwt';

describe('JWT Utils', () => {
  const payload = { id: 1, email: 'test@test.com', rol: 'usuario' as const };

  it('debe generar un token válido', () => {
    const token = generarToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('debe verificar un token válido', () => {
    const token = generarToken(payload);
    const decoded = verificarToken(token);
    expect(decoded.id).toBe(1);
    expect(decoded.email).toBe('test@test.com');
    expect(decoded.rol).toBe('usuario');
  });

  it('debe lanzar error con token inválido', () => {
    expect(() => verificarToken('token-falso')).toThrow();
  });

  it('debe lanzar error con token corrupto', () => {
    expect(() => verificarToken('a.b.c')).toThrow();
  });
});