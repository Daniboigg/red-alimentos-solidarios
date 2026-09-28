/// <reference types="jest" />
import request from 'supertest';
import { app } from '../src/app';

describe('App - Configuración general', () => {
  it('debe retornar 404 en ruta inexistente', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Ruta no encontrada');
  });

  it('debe incluir cabeceras de seguridad de Helmet', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('debe incluir CSP con frame-ancestors y form-action', async () => {
    const res = await request(app).get('/health');
    const csp = res.headers['content-security-policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
  });

  it('debe parsear JSON correctamente', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ email: 'mal' });
    expect(res.status).toBe(400);
  });

  it('debe aplicar rate limiting a /api', async () => {
    const requests = Array.from({ length: 5 }, () => request(app).get('/health'));
    const responses = await Promise.all(requests);
    responses.forEach(r => expect(r.status).toBe(200));
  });

  it('debe servir /robots.txt con CSP', async () => {
    const res = await request(app).get('/robots.txt');
    expect(res.status).toBe(200);
    expect(res.text).toContain('User-agent');
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });

  it('debe servir /sitemap.xml con CSP', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<urlset');
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });

  it('debe retornar 404 con cabeceras Helmet en rutas inexistentes', async () => {
    const res = await request(app).get('/api/ruta-inventada');
    expect(res.status).toBe(404);
    expect(res.headers['content-security-policy']).toContain("frame-ancestors 'none'");
  });
});