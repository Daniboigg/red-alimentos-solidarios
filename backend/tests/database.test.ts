/// <reference types="jest" />

// Este test verifica que la config del pool se cargue sin errores
describe('Database config', () => {
  it('debe exportar un pool configurado', () => {
    // Mockeamos pg para no conectar de verdad
    jest.doMock('pg', () => ({
      Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn(),
        on: jest.fn()
      }))
    }));

    const { pool } = require('../src/config/database');
    expect(pool).toBeDefined();
  });
});