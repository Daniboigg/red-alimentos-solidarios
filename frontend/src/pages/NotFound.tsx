import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6 text-red-500">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold text-slate-800">404</h1>
        <p className="text-xl text-slate-600 mt-4">Página no encontrada</p>
        <p className="text-slate-500 mt-2">La página que buscas no existe o fue movida.</p>
        <Link to="/dashboard" className="btn-primary mt-8 inline-flex">
          <Home className="w-4 h-4" />
          Ir al dashboard
        </Link>
      </div>
    </div>
  );
}