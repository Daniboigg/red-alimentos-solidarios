import { Package, Calendar, User } from 'lucide-react';
import { Badge } from './ui/Badge';
import type { Donacion } from '../types';

interface Props {
  donacion: Donacion;
}

export function DonationCard({ donacion }: Props) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{donacion.titulo}</h3>
        <Badge estado={donacion.estado} />
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{donacion.descripcion}</p>
      <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          <span>{donacion.cantidad} {donacion.unidad}</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="truncate">{donacion.donante_nombre}</span>
        </div>
        {donacion.fecha_vencimiento && (
          <div className="flex items-center gap-2 col-span-2">
            <Calendar className="w-4 h-4" />
            <span>Vence: {new Date(donacion.fecha_vencimiento).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}