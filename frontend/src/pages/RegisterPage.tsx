import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Activity } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      const response = await apiClient.post('/auth/register', { 
        email: formData.email, 
        password: formData.password,
        full_name: formData.full_name
      });
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white font-sans overflow-hidden">
      {/* Left Wing: Branding & Authority */}
      <div className="lg:w-[45%] bg-[#4a1d07] relative flex flex-col justify-center p-12 lg:p-20 text-white">
        {/* Faded Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
           <img src="/images/Seal_of_Maharashtra.svg.png" alt="" className="absolute -top-20 -right-20 w-[600px] h-auto grayscale invert" />
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
              <span>Official Personnel Onboarding</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
              SYSTEM <br/>
              <span className="text-primary-500 italic">ENROLLMENT</span>
            </h1>
            <p className="text-lg text-primary-100/70 font-medium max-w-md leading-relaxed">
              Authorized personnel registration for the State Health Intelligence Network.
            </p>
          </div>

          <div className="space-y-4 pt-10 border-t border-white/10">
             <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                   <span className="text-primary-500 font-black">01</span>
                </div>
                <p className="text-xs font-bold text-white/80">Identity verification via official institutional email.</p>
             </div>
             <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                   <span className="text-primary-500 font-black">02</span>
                </div>
                <p className="text-xs font-bold text-white/80">Hierarchical access control based on administrative role.</p>
             </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-12 lg:left-20 text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">
          Public Health Department - Maharashtra
        </div>
      </div>

      {/* Right Wing: Registration Portal */}
      <div className="flex-1 bg-surface-50 flex items-center justify-center p-8 lg:p-20 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
           <img src="/images/Seal_of_Maharashtra.svg.png" alt="" className="w-[500px] h-auto" />
        </div>

        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-primary-950 tracking-tight">Create Account</h2>
            <p className="text-sm text-text-400 font-bold uppercase tracking-widest">Enrollment Gateway</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {error && (
              <div className="bg-risk-critical-bg border-l-4 border-risk-critical p-4 rounded-r-xl">
                <p className="text-xs text-risk-critical font-black uppercase tracking-tight">{error}</p>
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Full Name</label>
              <input
                name="full_name"
                type="text"
                required
                className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Institutional Email</label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Security Key</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Confirm Key</label>
                <input
                  name="confirm_password"
                  type="password"
                  required
                  className="w-full px-5 py-4 bg-white border border-surface-200 rounded-2xl text-sm focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all shadow-sm"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 font-black text-sm uppercase tracking-[0.2em] transition-all mt-4"
            >
              Request Credentials
            </button>
          </form>

          <div className="pt-8 border-t border-surface-200 text-center">
            <p className="text-xs text-text-400 font-bold uppercase">
              Already authorized? <Link to="/login" className="text-primary-600 hover:underline">Sign In Instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
