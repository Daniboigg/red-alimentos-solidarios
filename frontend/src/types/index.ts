export type Rol = 'administrador' | 'usuario';
export type TipoUsuario = 'donante' | 'beneficiario';
export type EstadoDonacion = 'publicada' | 'solicitada' | 'aceptada' | 'en_transito' | 'entregada';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  tipo: TipoUsuario;
  creado_en?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface RegistroDTO {
  nombre: string;
  email: string;
  password: string;
  tipo: TipoUsuario;
  rol?: Rol;
  rfc?: string;
  telefono?: string;
}

export interface Donacion {
  id: number;
  titulo: string;
  descripcion: string;
  tipo_recurso: string;
  cantidad: number;
  unidad: string;
  estado: EstadoDonacion;
  donante_id: number;
  donante_nombre?: string;
  fecha_vencimiento?: string;
  creado_en: string;
}

export interface CrearDonacionDTO {
  titulo: string;
  descripcion: string;
  tipo_recurso: string;
  cantidad: number;
  unidad: string;
  fecha_vencimiento?: string;
}

export interface KPIReporte {
  total_donaciones: number;
  total_kg: number;
  total_beneficiarios: number;
  desperdicio_evitado_kg: number;
}