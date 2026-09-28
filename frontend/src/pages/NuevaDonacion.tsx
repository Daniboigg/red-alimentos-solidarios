import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { donationsService } from '../services/donationsService';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const TIPOS_RECURSO = [
  'Frutas', 'Verduras', 'Lácteos', 'Carnes', 'Panadería',
  'Granos', 'Enlatados', 'Bebidas', 'Otros'
];

const UNIDADES = ['kg', 'litros', 'unidades', 'cajas', 'paquetes'];

export function NuevaDonacion() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo_recurso: 'Frutas',
    cantidad: 0,
    unidad: 'kg',
    fecha_vencimiento: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await donationsService.crear(form);
      navigate('/donaciones');
    } catch (err: any) {
      setError(err.message || 'Error al crear la donación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/donaciones')}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a donaciones
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Nueva donación</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Publica un excedente para que las organizaciones puedan solicitarlo
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            label="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ej: 500 kg de fruta fresca"
            required
            minLength={5}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe el estado y detalles del recurso..."
              className="input-field min-h-[100px] resize-y"
              required
              minLength={10}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo de recurso
              </label>
              <select
                value={form.tipo_recurso}
                onChange={(e) => setForm({ ...form, tipo_recurso: e.target.value })}
                className="input-field"
              >
                {TIPOS_RECURSO.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unidad
              </label>
              <select
                value={form.unidad}
                onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                className="input-field"
              >
                {UNIDADES.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cantidad"
              type="number"
              value={form.cantidad || ''}
              onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
              placeholder="100"
              required
              min={1}
            />

            <Input
              label="Fecha de vencimiento (opcional)"
              type="date"
              value={form.fecha_vencimiento}
              onChange={(e) => setForm({ ...form, fecha_vencimiento: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" loading={loading} className="flex-1">
              Publicar donación
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/donaciones')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}