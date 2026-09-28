import type { Donacion, CrearDonacionDTO, KPIReporte } from '../types';

const MOCK_DONACIONES: Donacion[] = [
  {
    id: 1,
    titulo: '500 kg de fruta fresca',
    descripcion: 'Manzanas, peras y plátanos en buen estado',
    tipo_recurso: 'Frutas',
    cantidad: 500,
    unidad: 'kg',
    estado: 'publicada',
    donante_id: 1,
    donante_nombre: 'Supermercado XYZ',
    fecha_vencimiento: '2026-10-15',
    creado_en: new Date().toISOString()
  },
  {
    id: 2,
    titulo: '200 litros de leche',
    descripcion: 'Leche entera pasteurizada',
    tipo_recurso: 'Lácteos',
    cantidad: 200,
    unidad: 'litros',
    estado: 'aceptada',
    donante_id: 1,
    donante_nombre: 'Lácteos del Norte',
    fecha_vencimiento: '2026-10-05',
    creado_en: new Date().toISOString()
  },
  {
    id: 3,
    titulo: '150 kg de arroz',
    descripcion: 'Arroz blanco en sacos de 25kg',
    tipo_recurso: 'Granos',
    cantidad: 150,
    unidad: 'kg',
    estado: 'en_transito',
    donante_id: 2,
    donante_nombre: 'Distribuidora Central',
    creado_en: new Date().toISOString()
  },
  {
    id: 4,
    titulo: '300 kg de verduras',
    descripcion: 'Zanahorias, papas y cebollas',
    tipo_recurso: 'Verduras',
    cantidad: 300,
    unidad: 'kg',
    estado: 'entregada',
    donante_id: 1,
    donante_nombre: 'Mercado Local',
    creado_en: new Date().toISOString()
  }
];

export const donationsService = {
  async listar(): Promise<Donacion[]> {
    return Promise.resolve(MOCK_DONACIONES);
  },

  async crear(dto: CrearDonacionDTO): Promise<Donacion> {
    const nueva: Donacion = {
      id: MOCK_DONACIONES.length + 1,
      ...dto,
      estado: 'publicada',
      donante_id: 1,
      donante_nombre: 'Tú',
      creado_en: new Date().toISOString()
    };
    MOCK_DONACIONES.push(nueva);
    return Promise.resolve(nueva);
  },

  async obtenerKPIs(): Promise<KPIReporte> {
    return Promise.resolve({
      total_donaciones: MOCK_DONACIONES.length,
      total_kg: MOCK_DONACIONES.reduce((sum, d) => sum + d.cantidad, 0),
      total_beneficiarios: 1250,
      desperdicio_evitado_kg: 850
    });
  }
};