import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { 
  Hospital, 
  Bed, 
  Syringe, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface ResourceMapping {
  hospital_id: string;
  name: string;
  zone_id: string;
  predicted_7d_load: number;
  current_capacity: { beds: number; meds: number; vaccines: number; };
  status: { beds: string; supplies: string; };
  recommendation: string;
}

const HospitalResourcePage = () => {
  const [mappings, setMappings] = useState<ResourceMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertingSid, setAlertingSid] = useState<string | null>(null);
  const [sentAlerts, setSentAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    apiClient.get('/hospital/mapping')
      .then(r => setMappings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sendAlert = async (mapping: ResourceMapping) => {
    setAlertingSid(mapping.hospital_id);
    try {
      await apiClient.post('/notifications/hospital-alert', {
        hospital_name: mapping.name,
        contact: '+919637080703',
        message: `URGENT: Predicted ${mapping.predicted_7d_load} cases in next 7 days. Only ${mapping.current_capacity.beds} beds available. Activate emergency capacity protocol immediately.`
      });
      setSentAlerts(prev => new Set(prev).add(mapping.hospital_id));
    } catch (e) {
      console.error('Alert failed', e);
    } finally {
      setAlertingSid(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-surface-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-pulse"></div>
            <span>Logistics & Capacity Command</span>
          </div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tighter">Hospital Resource Mapping</h2>
          <p className="text-sm text-text-600 mt-1 font-medium italic">Balancing institutional capacity with epidemiological demand.</p>
        </div>
        <button className="mt-4 sm:mt-0 px-6 py-3 bg-primary-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-950 transition-all shadow-lg shadow-primary-900/20 flex items-center space-x-2">
          <span>Global Dispatch Center</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mappings.map((mapping) => (
          <div key={mapping.hospital_id} className="bg-white border border-surface-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="p-8">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                    <Hospital size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-primary-950 tracking-tight">{mapping.name}</h3>
                    <p className="text-[10px] font-bold text-text-400 uppercase tracking-widest mt-0.5">Primary Care Hub • Ward {mapping.zone_id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  mapping.status.beds === 'CRITICAL' 
                    ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' 
                    : 'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {mapping.status.beds}
                </div>
              </div>

              {/* Resource Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                  <div className="flex items-center space-x-2 text-text-400 mb-1">
                    <Bed size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Beds</span>
                  </div>
                  <p className="text-lg font-black text-primary-950">{mapping.current_capacity.beds}</p>
                </div>
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                  <div className="flex items-center space-x-2 text-text-400 mb-1">
                    <Package size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Med Kits</span>
                  </div>
                  <p className="text-lg font-black text-primary-950">{mapping.current_capacity.meds}</p>
                </div>
                <div className="p-4 bg-surface-50 rounded-2xl border border-surface-100">
                  <div className="flex items-center space-x-2 text-text-400 mb-1">
                    <Syringe size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Vaccines</span>
                  </div>
                  <p className="text-lg font-black text-primary-950">{mapping.current_capacity.vaccines}</p>
                </div>
              </div>

              {/* Demand Projection */}
              <div className="p-6 bg-primary-950 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-[0.2em] mb-1">Predicted 7-Day Load</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-black tabular-nums">{mapping.predicted_7d_load}</span>
                      <span className="text-xs font-bold text-primary-300">Cases Expected</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center space-x-1 justify-end ${mapping.status.beds === 'CRITICAL' ? 'text-red-400' : 'text-green-400'}`}>
                      {mapping.status.beds === 'CRITICAL' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                      <span className="text-xs font-black uppercase tracking-widest">
                        {mapping.status.beds === 'CRITICAL' ? 'Deficit' : 'Sufficient'}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 font-medium mt-1 uppercase tracking-tighter">Based on ML Projection</p>
                  </div>
                </div>
                {/* Visual Accent */}
                <TrendingUp size={120} className="absolute -right-8 -bottom-8 text-white/5 pointer-events-none" />
              </div>
            </div>

            {/* Recommendations Footer */}
            <div className={`p-5 flex items-center justify-between border-t border-surface-100 ${
              mapping.status.beds === 'CRITICAL' ? 'bg-red-50/30' : 'bg-surface-50/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`h-2 w-2 rounded-full ${mapping.status.beds === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                <p className="text-[11px] font-black text-text-900 uppercase tracking-widest">
                  Action: {mapping.recommendation.replace('_', ' ')}
                </p>
              </div>
              {mapping.status.beds === 'CRITICAL' ? (
                <button
                  onClick={() => sendAlert(mapping)}
                  disabled={alertingSid === mapping.hospital_id || sentAlerts.has(mapping.hospital_id)}
                  className="px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sentAlerts.has(mapping.hospital_id) ? 'Alert Sent!' : alertingSid === mapping.hospital_id ? 'Sending...' : 'Send Emergency Alert'}
                </button>
              ) : (
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Capacity OK</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HospitalResourcePage;
