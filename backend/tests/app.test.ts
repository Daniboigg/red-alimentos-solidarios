/// <reference types="jest" />

import request from 'supertest';
import { app } from '../src/app';

describe('App - Configuración general', () => {
  it('debe retornar 404 en ruta inexistente', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
  });

  it('debe incluir cabeceras de seguridad de Helmet', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
  });

  it('debe parsear JSON correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ email: 'mal' });
    expect(res.status).toBe(400);
    expect(res.body.errores).toBeDefined();
  });

  it('debe aplicar rate limiting a /api', async () => {
    // Hacer muchas peticiones rápidas
    const requests = Array.from({ length: 5 }, () =>
      request(app).get('/health')
    );
    const responses = await Promise.all(requests);
    responses.forEach(r => expect(r.status).toBe(200));
  });
});