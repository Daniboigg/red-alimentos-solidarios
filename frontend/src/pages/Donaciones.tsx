import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, PlusCircle, Search } from 'lucide-react';
import { donationsService } from '../services/donationsService';
import { DonationCard } from '../components/DonationCard';
import { EmptyState } from '../components/ui/EmptyState';
import type { Donacion, EstadoDonacion } from '../types';

export function Donaciones() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [filtradas, setFiltradas] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoDonacion | 'todas'>('todas');

  useEffect(() => {
    donationsService.listar().then((data: Donacion[]) => {
      setDonaciones(data);
      setFiltradas(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let resultado = donaciones;

    if (busqueda) {
      const q = busqueda.toLowerCase();
      resultado = resultado.filter(
        d =>
          d.titulo.toLowerCase().includes(q) ||
          d.descripcion.toLowerCase().includes(q) ||
          d.tipo_recurso.toLowerCase().includes(q)
      );
    }

    if (filtroEstado !== 'todas') {
      resultado = resultado.filter(d => d.estado === filtroEstado);
    }

    setFiltradas(resultado);
  }, [busqueda, filtroEstado, donaciones]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Donaciones</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {filtradas.length} donación{filtradas.length !== 1 ? 'es' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/donaciones/nueva" className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          Nueva donación
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar donaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            className="input-field sm:w-48"
          >
            <option value="todas">Todos los estados</option>
            <option value="publicada">Publicada</option>
            <option value="solicitada">Solicitada</option>
            <option value="aceptada">Aceptada</option>
            <option value="en_transito">En tránsito</option>
            <option value="entregada">Entregada</option>
          </select>
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Package className="w-8 h-8" />}
            title="No se encontraron donaciones"
            description="Intenta cambiar los filtros o crea una nueva donación"
            action={
              <Link to="/donaciones/nueva" className="btn-primary">
                <PlusCircle className="w-4 h-4" />
                Crear donación
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtradas.map(d => (
            <DonationCard key={d.id} donacion={d} />
          ))}
        </div>
      )}
    </div>
  );
}