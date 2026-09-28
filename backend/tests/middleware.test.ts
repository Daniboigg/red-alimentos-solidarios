/// <reference types="jest" />

import { Request, Response } from 'express';
import { autenticar, AuthRequest } from '../src/middleware/authMiddleware';
import { autorizar } from '../src/middleware/roleMiddleware';
import { generarToken } from '../src/utils/jwt';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('authMiddleware', () => {
  it('debe rechazar sin header Authorization', () => {
    const req = { headers: {} } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('debe rechazar header sin Bearer', () => {
    const req = { headers: { authorization: 'Basic xyz' } } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe aceptar token válido', () => {
    const token = generarToken({ id: 1, email: 'a@a.com', rol: 'usuario' });
    const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user?.email).toBe('a@a.com');
  });

  it('debe rechazar token inválido', () => {
    const req = { headers: { authorization: 'Bearer token-malo' } } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autenticar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('roleMiddleware', () => {
  it('debe rechazar sin usuario', () => {
    const req = {} as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autorizar('administrador')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe rechazar rol insuficiente', () => {
    const req = { user: { id: 1, email: 'a@a.com', rol: 'usuario' as const } } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autorizar('administrador')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('debe permitir rol correcto', () => {
    const req = { user: { id: 1, email: 'a@a.com', rol: 'administrador' as const } } as AuthRequest;
    const res = mockRes();
    const next = jest.fn();

    autorizar('administrador')(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});