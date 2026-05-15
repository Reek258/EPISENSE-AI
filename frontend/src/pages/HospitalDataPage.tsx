import React, { useEffect, useState } from 'react';
import { 
  Table, 
  PlusCircle, 
  CheckCircle2, 
  History, 
  MapPin, 
  Activity,
  AlertTriangle,
  ChevronRight,
  Database
} from 'lucide-react';
import apiClient from '../api/client';

const HospitalDataPage = () => {
  const [zones, setZones] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    zone_id: '',
    disease_type: 'Dengue',
    case_count: 0,
    severity_level: 'MODERATE'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonesRes, historyRes] = await Promise.all([
          apiClient.get('/zones'),
          apiClient.get('/hospital/history')
        ]);
        setZones(zonesRes.data);
        setHistory(historyRes.data.reverse());
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      await apiClient.post('/hospital/submit', formData);
      setSuccess(true);
      // Refresh history
      const historyRes = await apiClient.get('/hospital/history');
      setHistory(historyRes.data.reverse());
      // Reset form (except zone for convenience)
      setFormData(prev => ({ ...prev, case_count: 0 }));
      
      // Auto-hide success after 3s
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to submit data. Please check connection.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary-100 border-t-primary-600 rounded-full"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-surface-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-1">
            <Activity size={14} className="fill-current" />
            <span>Health Information System</span>
          </div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tighter">Clinical Case Reporting</h2>
          <p className="text-sm text-text-600 mt-1 font-medium italic">Authorized data entry portal for regional medical officers.</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
             <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
             <span>Secure Server Link Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Entry Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-surface-100 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="bg-primary-950 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-xl">
                   <PlusCircle size={24} />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight leading-tight">Submit New Record</h3>
                   <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mt-1">Live Case Entry</p>
                </div>
              </div>
            </div>

            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl flex items-center space-x-3 animate-in slide-in-from-top-2">
                  <CheckCircle2 className="text-green-600" size={20} />
                  <p className="text-xs font-black text-green-800 uppercase tracking-tight">Report Successfully Filed</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Assigned Ward / Zone</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                  <select 
                    required
                    className="w-full pl-12 pr-4 py-4 bg-surface-50 border border-surface-200 rounded-2xl text-sm font-bold focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all appearance-none"
                    value={formData.zone_id}
                    onChange={(e) => setFormData({...formData, zone_id: e.target.value})}
                  >
                    <option value="">Select Ward</option>
                    {zones.map(zone => (
                      <option key={zone.id} value={zone.id}>{zone.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Pathogen / Disease focus</label>
                <select 
                  className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl text-sm font-bold focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all"
                  value={formData.disease_type}
                  onChange={(e) => setFormData({...formData, disease_type: e.target.value})}
                >
                  <option>Dengue</option>
                  <option>Malaria</option>
                  <option>Chikungunya</option>
                  <option>Zika Virus</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Confirmed Case Count</label>
                <input 
                  type="number"
                  required
                  min="0"
                  className="w-full px-5 py-4 bg-surface-50 border border-surface-200 rounded-2xl text-lg font-black text-primary-950 focus:ring-8 focus:ring-primary-500/5 focus:border-primary-600 outline-none transition-all tabular-nums"
                  value={formData.case_count}
                  onChange={(e) => setFormData({...formData, case_count: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-text-600 uppercase tracking-widest ml-1">Severity Assessment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['STABLE', 'MODERATE', 'CRITICAL'].map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setFormData({...formData, severity_level: level})}
                      className={`py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                        formData.severity_level === level 
                          ? 'bg-primary-900 text-white border-primary-950 shadow-lg shadow-primary-900/20' 
                          : 'bg-white text-text-400 border-surface-200 hover:border-primary-300'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-600/20 font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
              >
                {submitting ? (
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Database size={16} />
                    <span>Submit to Central Registry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-surface-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 bg-surface-50 border-b border-surface-100 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-primary-50 rounded-xl text-primary-900 border border-primary-100 shadow-sm">
                   <History size={20} />
                </div>
                <div>
                   <h3 className="text-md font-black text-primary-950 leading-tight">Institutional Audit Trail</h3>
                   <p className="text-[10px] font-bold text-text-400 uppercase tracking-tighter">Latest Clinical Submissions</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">View Full Registry</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-50/50 border-b border-surface-50">
                    <th className="px-6 py-4 text-[9px] font-black text-text-400 uppercase tracking-[0.15em]">Submission Time</th>
                    <th className="px-6 py-4 text-[9px] font-black text-text-400 uppercase tracking-[0.15em]">Ward / Zone</th>
                    <th className="px-6 py-4 text-[9px] font-black text-text-400 uppercase tracking-[0.15em]">Disease</th>
                    <th className="px-6 py-4 text-[9px] font-black text-text-400 uppercase tracking-[0.15em] text-center">Cases</th>
                    <th className="px-6 py-4 text-[9px] font-black text-text-400 uppercase tracking-[0.15em] text-center">Alert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50">
                  {history.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-primary-50/20 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-[11px] font-black text-primary-950">
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-[9px] font-bold text-text-400 uppercase tracking-tighter">{entry.date}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-primary-950 text-xs">
                        {zones.find(z => z.id === entry.zone_id)?.name || entry.zone_id}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-surface-100 rounded text-[9px] font-bold text-text-700 uppercase tracking-widest">{entry.disease_type}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-black text-primary-950 tabular-nums">{entry.case_count}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {entry.severity === 'CRITICAL' ? (
                          <AlertTriangle size={16} className="text-risk-critical mx-auto" />
                        ) : (
                          <ShieldCheck size={16} className="text-green-500 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center opacity-20">
                           <Database size={40} />
                           <p className="mt-4 text-xs font-black uppercase tracking-widest">No active submissions found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDataPage;
