import { useEffect, useState } from 'react';
import { reportsApi, type WaterReport } from '../api/reports';
import { 
  Droplet, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';

const WaterReportsPage = () => {
  const [reports, setReports] = useState<WaterReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await reportsApi.getAllReports();
        setReports(data);
      } catch (error) {
        console.error('Failed to fetch reports', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-risk-critical bg-risk-critical-bg border-risk-critical/20';
      case 'medium': return 'text-risk-moderate bg-risk-moderate-bg border-risk-moderate/20';
      case 'low': return 'text-risk-low bg-risk-low-bg border-risk-low/20';
      default: return 'text-text-500 bg-surface-100 border-surface-200';
    }
  };

  const filteredReports = reports.filter(r => {
    if (filter === 'all') return true;
    return r.severity.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary-900">Citizen Water Reports</h2>
          <p className="text-sm text-text-500 mt-1">Manage and verify community-reported water stagnation and leakages.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-400" size={16} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="pl-10 pr-4 py-2 border border-surface-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all"
            />
          </div>
          <button className="p-2 border border-surface-200 rounded-lg text-text-600 hover:bg-surface-50 transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-white border border-surface-100 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Droplet size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-500 uppercase">Total Reports</p>
            <p className="text-xl font-extrabold text-primary-900">{reports.length}</p>
          </div>
        </div>
        <div className="bg-surface-white border border-surface-100 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-risk-critical-bg text-risk-critical rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-500 uppercase">High Severity</p>
            <p className="text-xl font-extrabold text-primary-900">
              {reports.filter(r => r.severity.toLowerCase() === 'high').length}
            </p>
          </div>
        </div>
        <div className="bg-surface-white border border-surface-100 p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-risk-low-bg text-risk-low rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-text-500 uppercase">Pending Review</p>
            <p className="text-xl font-extrabold text-primary-900">
              {reports.filter(r => (r as any).status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2 border-b border-surface-100 pb-1">
        {['all', 'high', 'medium', 'low'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-bold capitalize transition-all border-b-2 ${
              filter === f 
              ? 'text-teal-600 border-teal-600' 
              : 'text-text-400 border-transparent hover:text-text-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id} 
            className="bg-surface-white border border-surface-100 rounded-xl overflow-hidden hover:shadow-md transition-all group"
          >
            <div className="flex h-full">
              {/* Image Thumbnail */}
              <div className="w-32 bg-surface-100 flex-shrink-0 relative overflow-hidden">
                {report.image_url ? (
                  <img src={report.image_url} alt="Report" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Droplet size={32} className="text-text-300" />
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getSeverityColor(report.severity)}`}>
                  {report.severity}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-primary-900 line-clamp-1">
                      {report.description || 'Unnamed Stagnation Report'}
                    </h4>
                    <button className="text-text-400 hover:text-teal-600 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-[11px] text-text-500">
                      <MapPin size={12} className="mr-1.5" />
                      <span className="tabular-nums">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                    </div>
                    <div className="flex items-center text-[11px] text-text-500">
                      <Clock size={12} className="mr-1.5" />
                      <span>{report.reported_at ? new Date(report.reported_at).toLocaleString() : 'Just Now'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-bold text-text-600">
                      {report.reporter_name.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-text-600">{report.reporter_name}</span>
                  </div>
                  <button 
                    onClick={async () => {
                      if (window.confirm("Mark this hazard as solved and remove it from the list?")) {
                        await reportsApi.deleteReport(report.id!);
                        setReports(reports.filter(r => r.id !== report.id));
                      }
                    }}
                    className="text-[11px] font-black text-green-600 hover:text-green-700 uppercase tracking-widest px-3 py-1.5 bg-green-50 rounded-lg border border-green-100 transition-all hover:scale-105 active:scale-95"
                  >
                    Resolve & Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredReports.length === 0 && (
        <div className="py-20 text-center bg-surface-50 rounded-xl border-2 border-dashed border-surface-200">
          <Droplet size={48} className="mx-auto text-text-300 mb-4" />
          <p className="text-text-500 font-medium">No water reports found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default WaterReportsPage;
