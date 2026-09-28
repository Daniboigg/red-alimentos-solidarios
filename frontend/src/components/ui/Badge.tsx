import type { EstadoDonacion } from '../../types';

interface Props {
  estado: EstadoDonacion;
}

const ESTILOS: Record<EstadoDonacion, string> = {
  publicada: 'bg-blue-100 text-blue-700',
  solicitada: 'bg-yellow-100 text-yellow-700',
  aceptada: 'bg-purple-100 text-purple-700',
  en_transito: 'bg-orange-100 text-orange-700',
  entregada: 'bg-green-100 text-green-700'
};

const ETIQUETAS: Record<EstadoDonacion, string> = {
  publicada: 'Publicada',
  solicitada: 'Solicitada',
  aceptada: 'Aceptada',
  en_transito: 'En tránsito',
  entregada: 'Entregada'
};

export function Badge({ estado }: Props) {
  return (
    <span className={`badge ${ESTILOS[estado]}`}>
      {ETIQUETAS[estado]}
    </span>
  );
}