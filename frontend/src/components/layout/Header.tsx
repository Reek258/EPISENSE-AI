import { useAuthStore } from '../../store/useAuthStore';
import { Bell, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="flex flex-col w-full shadow-md z-30">
      {/* 3px Tri-band */}
      <div className="h-[3px] w-full flex">
        <div className="bg-[#FF9933] w-1/3 h-full"></div>
        <div className="bg-white w-1/3 h-full"></div>
        <div className="bg-[#138808] w-1/3 h-full"></div>
      </div>

      <div className="bg-primary-900 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center p-1">
             {/* Simple Ashoka Chakra Placeholder */}
             <div className="w-full h-full border-2 border-primary-900 rounded-full border-dotted"></div>
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">
              EPISENCE
            </h1>
            <p className="text-[10px] text-text-400 uppercase tracking-widest font-medium">
              National Centre for Disease Control
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-text-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-risk-critical rounded-full text-[10px] text-white flex items-center justify-center border-2 border-primary-900">
              3
            </span>
          </button>
          
          <div className="h-8 w-px bg-primary-800"></div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.full_name}</p>
              <p className="text-[10px] text-text-400 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="group relative">
              <button className="h-9 w-9 bg-primary-700 rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors">
                <User size={20} />
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-surface-white rounded-md shadow-xl border border-surface-100 py-1 hidden group-hover:block z-50">
                <button 
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-text-900 hover:bg-surface-50 flex items-center space-x-2"
                >
                  <LogOut size={16} className="text-text-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
