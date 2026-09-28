import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, TrendingUp, Award, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { donationsService } from '../services/donationsService';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { DonationCard } from '../components/DonationCard';
import type { Donacion, KPIReporte } from '../types';

export function Dashboard() {
  const { usuario } = useAuth();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [kpis, setKpis] = useState<KPIReporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [d, k] = await Promise.all([
        donationsService.listar(),
        donationsService.obtenerKPIs()
      ]);
      setDonaciones(d.slice(0, 3));
      setKpis(k);
      setLoading(false);
    };
    cargar();
  }, []);

  if (loading || !kpis) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Bienvenido, {usuario?.nombre}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Aquí está el resumen de tu actividad en la red
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Donaciones totales"
          value={kpis.total_donaciones}
          icon={<Package className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Kilogramos donados"
          value={`${kpis.total_kg} kg`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Beneficiarios"
          value={kpis.total_beneficiarios}
          icon={<Users className="w-6 h-6" />}
          color="warning"
        />
        <StatCard
          title="Desperdicio evitado"
          value={`${kpis.desperdicio_evitado_kg} kg`}
          icon={<Award className="w-6 h-6" />}
          color="danger"
        />
      </div>

      <Card
        title="Donaciones recientes"
        subtitle="Las últimas 3 donaciones registradas"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {donaciones.map(d => (
            <DonationCard key={d.id} donacion={d} />
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Link to="/donaciones" className="btn-secondary">
            Ver todas las donaciones
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Acciones rápidas">
          <div className="space-y-3">
            <Link
              to="/donaciones/nueva"
              className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">Nueva donación</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Publica un excedente</p>
              </div>
            </Link>
            <Link
              to="/reportes"
              className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-100">Ver reportes</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Analiza tu impacto</p>
              </div>
            </Link>
          </div>
        </Card>

        <Card title="Sobre el proyecto">
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            Red de Alimentos Solidarios conecta empresas con excedentes alimenticios
            con organizaciones sociales que los necesitan. Cada donación se rastrea
            para garantizar transparencia y maximizar el impacto social.
          </p>
          <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm text-primary-700 dark:text-primary-300">
              🌱 Tu participación ayuda a reducir el desperdicio de alimentos y a
              combatir la inseguridad alimentaria.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}