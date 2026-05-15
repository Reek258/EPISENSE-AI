import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Table, 
  FileText, 
  BarChart3, 
  AlertTriangle,
  Settings,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = ({ className }: { className?: string }) => {
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Hospital Data', path: '/hospital', icon: Table, roles: ['admin', 'health_officer'] },
    { name: 'Water Reports', path: '/reports', icon: FileText },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin', 'health_officer'] },
    { name: 'Resource Mapping', path: '/resources', icon: Table },
    { name: 'Alert Center', path: '/alerts', icon: AlertTriangle },
  ];

  return (
    <aside className={`flex flex-col bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 bg-primary-50/50 border-b border-surface-50">
        <p className="text-[10px] font-black text-primary-900 uppercase tracking-widest text-center">Navigation Hub</p>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1.5">
        {navItems.map((item) => {
          if (item.roles && !item.roles.includes(user?.role || '')) return null;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20' 
                  : 'text-text-600 hover:bg-primary-50 hover:text-primary-900'
                }
              `}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 bg-surface-50">
        <NavLink
          to="/settings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-400 hover:bg-white hover:text-primary-900 hover:shadow-sm transition-all"
        >
          <Settings size={20} />
          <span className="font-bold text-sm">System Settings</span>
        </NavLink>
        
        <div className="mt-4 p-4 bg-white rounded-xl border border-surface-100 shadow-sm">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-text-900 uppercase tracking-widest">Network Active</span>
          </div>
          <p className="mt-1 text-[9px] text-text-400 font-medium leading-tight">Verified Institutional Access</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
