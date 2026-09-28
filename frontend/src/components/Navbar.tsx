import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, Heart, LayoutDashboard, Package,
  PlusCircle, BarChart3, Menu, X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/donaciones', icon: Package, label: 'Donaciones' },
    { to: '/donaciones/nueva', icon: PlusCircle, label: 'Nueva' },
    { to: '/reportes', icon: BarChart3, label: 'Reportes' }
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 font-bold text-xl">
              <Heart className="w-6 h-6" />
              <span className="hidden sm:block">Red Alimentos</span>
            </Link>
            <div className="hidden md:flex space-x-1">
              {links.map(link => {
                const Icon = link.icon;
                const activo = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activo
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-slate-800'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50 dark:text-slate-300 dark:hover:text-primary-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{usuario?.nombre}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{usuario?.tipo}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              className="md:hidden p-2 text-slate-500 dark:text-slate-400"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuAbierto && (
          <div className="md:hidden py-4 space-y-1 border-t border-slate-200 dark:border-slate-800">
            {links.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuAbierto(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}