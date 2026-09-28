import { useEffect, useState } from 'react';
import { Package, Users, TrendingUp, Award, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { donationsService } from '../services/donationsService';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import type { KPIReporte, Donacion } from '../types';

const COLORES_PIE = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Reportes() {
  const { tema } = useTheme();
  const [kpis, setKpis] = useState<KPIReporte | null>(null);
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [k, d] = await Promise.all([
        donationsService.obtenerKPIs(),
        donationsService.listar()
      ]);
      setKpis(k);
      setDonaciones(d);
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

  const datosPorTipo = Object.entries(
    donaciones.reduce((acc, d) => {
      acc[d.tipo_recurso] = (acc[d.tipo_recurso] || 0) + d.cantidad;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, kg]) => ({ name, kg }));

  const datosPorEstado = Object.entries(
    donaciones.reduce((acc, d) => {
      acc[d.estado] = (acc[d.estado] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const textoEje = tema === 'dark' ? '#94a3b8' : '#64748b';
  const lineaGrid = tema === 'dark' ? '#334155' : '#e2e8f0';
  const tooltipBg = tema === 'dark' ? '#1e293b' : '#ffffff';
  const tooltipBorder = tema === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Reportes de Impacto</h1>
          <p className="text-slate-500 dark:text-slate-400">Análisis de tu contribución social</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Donaciones" value={kpis.total_donaciones} icon={<Package className="w-6 h-6" />} color="primary" />
        <StatCard title="Kilogramos" value={`${kpis.total_kg} kg`} icon={<TrendingUp className="w-6 h-6" />} color="success" />
        <StatCard title="Beneficiarios" value={kpis.total_beneficiarios} icon={<Users className="w-6 h-6" />} color="warning" />
        <StatCard title="Desperdicio evitado" value={`${kpis.desperdicio_evitado_kg} kg`} icon={<Award className="w-6 h-6" />} color="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Kilogramos por tipo de recurso">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={datosPorTipo}>
                <CartesianGrid strokeDasharray="3 3" stroke={lineaGrid} />
                <XAxis dataKey="name" stroke={textoEje} fontSize={12} />
                <YAxis stroke={textoEje} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: tema === 'dark' ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Bar dataKey="kg" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Distribución por estado">
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={datosPorEstado}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {datosPorEstado.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORES_PIE[index % COLORES_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: '8px',
                    color: tema === 'dark' ? '#f1f5f9' : '#1e293b'
                  }}
                />
                <Legend
                  wrapperStyle={{ color: tema === 'dark' ? '#f1f5f9' : '#1e293b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}