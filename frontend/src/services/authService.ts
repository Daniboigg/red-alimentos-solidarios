import { api } from './api';
import type { LoginResponse, RegistroDTO, Usuario } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    return data;
  },

  async registro(dto: RegistroDTO): Promise<{ mensaje: string; usuario: Usuario }> {
    const { data } = await api.post('/auth/registro', dto);
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
};