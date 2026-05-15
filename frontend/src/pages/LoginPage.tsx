import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Activity } from 'lucide-react';
import ReportHazardModal from '../components/modals/ReportHazardModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please try again.');
    }
  };
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Left Wing: Branding & Authority */}
      <div className="lg:w-[45%] bg-[#4a1d07] relative flex flex-col justify-center p-12 lg:p-20 text-white">
        {/* Faded Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
           <img src="/images/Seal_of_Maharashtra.svg.png" alt="" className="absolute -bottom-20 -left-20 w-[600px] h-auto grayscale invert" />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex items-center space-x-6">
            <img src="/images/Seal_of_Maharashtra.svg.png" alt="Maharashtra Seal" className="h-20 w-auto drop-shadow-2xl" />
            <div className="h-12 w-[1px] bg-white/20"></div>
            <img src="/images/logo episense.png" alt="EPISENCE Logo" className="h-24 w-auto drop-shadow-2xl" />
            <div className="h-12 w-[1px] bg-white/20"></div>
            <img src="/images/india logo.png" alt="India Logo" className="h-20 w-auto drop-shadow-2xl brightness-0 invert" />
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-600/20 border border-primary-600/30 rounded-full text-primary-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <span>Verified Institutional Access</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
              HEALTH <br/>
              <span className="text-primary-500 italic">INTELLIGENCE</span>
            </h1>
            <p className="text-lg text-primary-100/70 font-medium max-w-md leading-relaxed">
              Unified Epidemiological Surveillance & Response Management System for the Government of Maharashtra.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
            <div className="space-y-2">
              <p className="text-primary-500 font-black text-xs uppercase tracking-widest">01. Real-time</p>
              <p className="text-xs text-white/60 leading-relaxed font-medium">Instant synchronization with hospital case data across all 15 PMC wards.</p>
            </div>
            <div className="space-y-2">
              <p className="text-primary-500 font-black text-xs uppercase tracking-widest">02. Predictive</p>
              <p className="text-xs text-white/60 leading-relaxed font-medium">Machine Learning driven 7-day outbreak forecasting and risk assessment.</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-12 lg:left-20 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
          Department of Health & Family Welfare
        </div>
      </div>

      {/* Right Wing: Access Portal */}
      <div className="flex-1 bg-surface-50 flex items-center justify-center p-8 lg:p-20 relative">
        {/* Subtle Watermark for Right Side */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
           <img src="/images/Seal_of_Maharashtra.svg.png" alt="" className="w-[500px] h-auto" />
        </div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-primary-950 tracking-tight">Official Sign In</h2>
            <p className="text-sm text-text-400 font-bold uppercase tracking-widest">Administrative Gateway</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-risk-critical-bg border-l-4 border-risk-critical p-4 rounded-r-xl">
                <p className="text-xs text-risk-critical font-black uppercase tracking-tight">{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Personnel Email</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                placeholder="Ex: officer@episence.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Security Key</label>
              <input
                type="password"
                required
                className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
            >
              Authorize & Enter
            </button>
          </form>

          <div className="pt-8 border-t border-surface-200 text-center space-y-6">
            <p className="text-xs text-text-400 font-bold uppercase">
              First time user? <Link to="/register" className="text-primary-600 hover:underline">Request New Credentials</Link>
            </p>

            <div className="pt-4">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="w-full py-4 border-2 border-primary-600/30 text-primary-700 rounded-2xl hover:bg-primary-50 transition-all font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3"
              >
                <div className="p-1.5 bg-primary-600 text-white rounded-lg">
                  <Activity size={16} />
                </div>
                <span>Report Stagnant Water / Hazard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ReportHazardModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
