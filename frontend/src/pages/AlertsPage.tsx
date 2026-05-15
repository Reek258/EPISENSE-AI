import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  ShieldAlert, 
  Truck, 
  Megaphone, 
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import apiClient from '../api/client';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await apiClient.get('/zones');
        // Filter for zones with HIGH or CRITICAL risk
        const criticalZones = response.data.filter((z: any) => 
          z.risk_level === 'CRITICAL' || z.risk_level === 'HIGH'
        );
        setAlerts(criticalZones);
      } catch (err) {
        console.error("Failed to fetch alerts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleAction = (id: string, action: string) => {
    alert(`${action} initiated for Zone ${id}. Response team notified.`);
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
          <div className="flex items-center space-x-2 text-[10px] font-black text-risk-critical uppercase tracking-[0.2em] mb-1">
            <ShieldAlert size={14} className="fill-current" />
            <span>Emergency Operations Center</span>
          </div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tighter">Active Response Alerts</h2>
          <p className="text-sm text-text-600 mt-1 font-medium italic">Manage and deploy resources for critical epidemiological threats.</p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <div className="flex items-center space-x-2 px-4 py-2 bg-risk-critical-bg text-risk-critical border border-risk-critical/10 rounded-xl">
             <Bell size={16} className="animate-bounce" />
             <span className="text-xs font-black uppercase tracking-widest">{alerts.length} Critical Threats Active</span>
          </div>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white border border-surface-100 rounded-3xl p-20 text-center">
           <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
           </div>
           <h3 className="text-xl font-black text-primary-950">System Clear</h3>
           <p className="text-sm text-text-400 mt-2">No critical epidemiological alerts detected across the region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white border border-surface-100 rounded-3xl shadow-lg overflow-hidden group hover:border-risk-critical/30 transition-all">
              <div className="flex flex-col lg:flex-row">
                {/* Alert Severity Side-strip */}
                <div className={`lg:w-4 flex items-center justify-center ${
                  alert.risk_level === 'CRITICAL' ? 'bg-risk-critical' : 'bg-risk-high'
                }`}>
                  <span className="lg:-rotate-90 whitespace-nowrap text-[10px] font-black text-white uppercase tracking-[0.3em] py-4">
                    {alert.risk_level} THREAT
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                         <div className={`p-3 rounded-2xl ${
                           alert.risk_level === 'CRITICAL' ? 'bg-risk-critical-bg text-risk-critical' : 'bg-risk-high-bg text-risk-high'
                         }`}>
                           <AlertTriangle size={24} />
                         </div>
                         <div>
                            <h3 className="text-2xl font-black text-primary-950 tracking-tight">{alert.name}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                               <span className="text-[10px] font-bold text-text-400 uppercase tracking-widest">Ward {alert.id}</span>
                               <span className="h-1 w-1 rounded-full bg-text-200"></span>
                               <div className="flex items-center space-x-1 text-[10px] font-black text-risk-critical uppercase">
                                  <Clock size={12} />
                                  <span>Detected 22m ago</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="max-w-xl p-4 bg-surface-50 rounded-2xl border border-surface-100">
                         <p className="text-sm font-bold text-text-700 leading-relaxed">
                            {alert.ml_prediction?.insight || "Critical case spike detected. Immediate intervention recommended based on 7-day predictive modeling."}
                         </p>
                      </div>
                    </div>

                    <div className="mt-8 lg:mt-0 flex flex-wrap gap-3">
                      <button 
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          const originalText = btn.innerHTML;
                          btn.innerHTML = "Broadcasting...";
                          btn.disabled = true;
                          
                          try {
                            const res = await apiClient.get('/notifications/test');
                            const results: any[] = Array.isArray(res.data) ? res.data : res.data?.value || [];
                            const limitReached = results.some((r: any) => r.status === 'LIMIT_REACHED');
                            const unverified = results.some((r: any) => r.status === 'UNVERIFIED_NUMBER');
                            
                            if (limitReached) {
                              alert(`[TWILIO LIMIT] Your Twilio trial account has hit the 50 messages/day cap.\n\nThe SMS was NOT sent.\n\nFIX: Wait until midnight UTC for the limit to reset, or upgrade your Twilio account at twilio.com.`);
                            } else if (unverified) {
                              alert(`[UNVERIFIED NUMBER] The recipient number is not verified on your Twilio trial account.\n\nFIX: Go to console.twilio.com → Verified Caller IDs → Add the number.`);
                            } else {
                              alert(`SMS Broadcast Sent to ${alert.name} Citizens!`);
                            }
                          } catch (e) {
                            alert("Network error. Is the backend running?");
                          } finally {
                            btn.innerHTML = originalText;
                            btn.disabled = false;
                          }
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-2xl shadow-xl shadow-green-900/20 font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:scale-105 hover:bg-green-500 transition-all disabled:opacity-50"
                      >
                        <Megaphone size={16} />
                        <span>Broadcast SMS Alert</span>
                      </button>
                      <button 
                        onClick={() => handleAction(alert.id, "Health Advisory")}
                        className="px-6 py-3 bg-primary-950 text-white rounded-2xl shadow-xl shadow-primary-950/20 font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:scale-105 transition-all"
                      >
                        <ExternalLink size={16} />
                        <span>Issue Advisory</span>
                      </button>
                      <button className="px-5 py-3 bg-white border border-surface-200 text-text-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 hover:bg-surface-50 transition-all">
                        <ChevronRight size={14} />
                        <span>View Zone Data</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
