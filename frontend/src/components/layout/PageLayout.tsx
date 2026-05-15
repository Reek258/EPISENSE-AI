import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/useAuthStore';
import { LogOut } from 'lucide-react';

const PageLayout = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 font-sans">
      {/* Official Government Top Bar */}
      <div className="bg-[#4a1d07] text-white py-1 px-4 text-[10px] flex justify-between items-center border-b border-white/10">
        <div className="flex items-center space-x-4">
          <span className="font-bold uppercase tracking-widest opacity-80">Government of Maharashtra</span>
          <span className="opacity-40">|</span>
          <span className="uppercase tracking-widest opacity-80">Pune Municipal Corporation</span>
        </div>
        <div className="flex items-center space-x-4 opacity-80 uppercase tracking-widest">
          <a href="#" className="hover:text-primary-400">Main Content</a>
          <span>|</span>
          <a href="#" className="hover:text-primary-400">Screen Reader</a>
        </div>
      </div>

      {/* Institutional Header */}
      <header className="bg-white border-b border-surface-200 shadow-sm sticky top-0 z-[1000]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <img src="/images/Seal_of_Maharashtra.svg.png" alt="Maharashtra Seal" className="h-14 w-auto" />
            <div className="h-10 w-[1px] bg-surface-200 hidden sm:block"></div>
            <img src="/images/logo episense.png" alt="EPISENCE Logo" className="h-12 w-auto" />
            <div className="flex flex-col border-l border-surface-200 pl-4">
              <h1 className="text-xl font-black text-primary-950 tracking-tighter leading-none">EPISENSE AI</h1>
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.2em] mt-1">Unified Health Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <img src="/images/india logo.png" alt="India Logo" className="h-10 w-auto opacity-80" />

            <div className="flex items-center space-x-3 pl-6 border-l border-surface-100">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-primary-900 leading-tight">{user?.full_name}</p>
                <p className="text-[9px] font-bold text-text-400 uppercase tracking-widest">{user?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all border border-primary-100 shadow-sm group"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6">
        <Sidebar className="hidden lg:block w-64 mr-8" />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
