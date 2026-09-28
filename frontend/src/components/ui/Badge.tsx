import type { EstadoDonacion } from '../../types';

interface Props {
  estado: EstadoDonacion;
}

const ESTILOS: Record<EstadoDonacion, string> = {
  publicada: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  solicitada: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  aceptada: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  en_transito: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  entregada: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
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