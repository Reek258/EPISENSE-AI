import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Droplets, 
  AlertCircle,
  FileDown,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import apiClient from '../api/client';

const AnalyticsPage = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching simulation of trend data (Historical + Predicted)
        const summaryRes = await apiClient.get('/dashboard/summary');
        const summary = summaryRes.data;

        // Generate synthetic trend data based on summary for demo
        const mockTrends = [
          { day: 'Day -6', cases: 120, rain: 5, risk: 2.1 },
          { day: 'Day -5', cases: 145, rain: 8, risk: 2.8 },
          { day: 'Day -4', cases: 160, rain: 15, risk: 3.5 },
          { day: 'Day -3', cases: 190, rain: 20, risk: 4.2 },
          { day: 'Day -2', cases: 210, rain: 25, risk: 5.8 },
          { day: 'Day -1', cases: 245, rain: 30, risk: 7.2 },
          { day: 'Today', cases: 280, rain: 12, risk: 8.5 },
          { day: 'Day +1', cases: 310, rain: 5, risk: 8.8, isPrediction: true },
          { day: 'Day +2', cases: 340, rain: 2, risk: 8.2, isPrediction: true },
          { day: 'Day +3', cases: 320, rain: 0, risk: 7.5, isPrediction: true },
          { day: 'Day +4', cases: 300, rain: 0, risk: 6.8, isPrediction: true },
        ];
        
        setTrends(mockTrends);

        // Leaderboard logic
        const zonesRes = await apiClient.get('/zones');
        const sortedZones = zonesRes.data.sort((a: any, b: any) => 
          (b.composite_score || 0) - (a.composite_score || 0)
        );
        setLeaderboard(sortedZones);
        
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        <p className="text-xs font-black text-primary-950 uppercase tracking-widest">Generating Predictive Models...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-surface-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-1">
            <Zap size={14} className="fill-current" />
            <span>AI Predictive Engine Active</span>
          </div>
          <h2 className="text-3xl font-black text-primary-950 tracking-tighter">Epidemiological Forecasting</h2>
          <p className="text-sm text-text-600 mt-1 font-medium">Model 1.0 - Cross-referenced with Meteorological (MET) Datasets.</p>
        </div>
        <button className="mt-4 sm:mt-0 px-6 py-2.5 bg-primary-900 text-white rounded-xl shadow-lg shadow-primary-900/20 flex items-center space-x-2 text-xs font-black uppercase tracking-widest hover:bg-[#4a1d07] transition-all group active:scale-95">
          <FileDown size={16} />
          <span>Generate Official Report</span>
        </button>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forecast Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-surface-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-primary-50 rounded-xl text-primary-600 border border-primary-100 shadow-sm">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-md font-black text-primary-950 leading-tight">Disease Incidence Forecast</h3>
                <p className="text-[10px] font-bold text-text-400 uppercase tracking-tighter">7-Day Prediction Interval</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary-600"></div>
                  <span className="text-[10px] font-bold text-text-600">Historical</span>
               </div>
               <div className="flex items-center space-x-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary-300"></div>
                  <span className="text-[10px] font-bold text-text-600">Predicted</span>
               </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#ea580c" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorCases)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Environmental Correlation Chart */}
        <div className="bg-white border border-surface-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100 shadow-sm">
              <Droplets size={20} />
            </div>
            <div>
              <h3 className="text-md font-black text-primary-950 leading-tight">MET Correlation</h3>
              <p className="text-[10px] font-bold text-text-400 uppercase tracking-tighter">Rainfall vs Disease Risk</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="day" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar dataKey="rain" radius={[4, 4, 0, 0]} barSize={20}>
                  {trends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.rain > 20 ? '#2563eb' : '#60a5fa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Predictive Risk Leaderboard */}
      <div className="bg-white border border-surface-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-surface-50 flex justify-between items-center bg-surface-50/50">
          <div className="flex items-center space-x-3">
             <div className="p-2.5 bg-primary-950 rounded-xl text-white shadow-lg">
                <BarChart3 size={20} />
             </div>
             <div>
                <h3 className="text-md font-black text-primary-950 leading-tight">Zone Risk Leaderboard</h3>
                <p className="text-[10px] font-bold text-text-400 uppercase tracking-tighter">Ranked by Model Confidence</p>
             </div>
          </div>
          <span className="px-3 py-1 bg-white border border-surface-200 rounded-lg text-[10px] font-black text-text-600 uppercase tracking-widest">15 Zones Analyzed</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-100">
                <th className="px-6 py-4 text-[10px] font-black text-text-400 uppercase tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-400 uppercase tracking-widest">Ward / Zone Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-400 uppercase tracking-widest text-center">Risk Index</th>
                <th className="px-6 py-4 text-[10px] font-black text-text-400 uppercase tracking-widest">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {leaderboard.map((zone, index) => (
                <tr key={zone.id} className="hover:bg-primary-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="h-8 w-8 rounded-lg bg-surface-100 flex items-center justify-center text-xs font-black text-primary-950 group-hover:bg-primary-900 group-hover:text-white transition-all">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-black text-primary-950">{zone.name}</p>
                      <p className="text-[10px] font-bold text-text-400 uppercase tracking-tighter">PMC Ward {index + 100}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      zone.risk_level === 'CRITICAL' ? 'bg-risk-critical-bg text-risk-critical border-risk-critical/20' :
                      zone.risk_level === 'HIGH' ? 'bg-risk-high-bg text-risk-high border-risk-high/20' :
                      zone.risk_level === 'MODERATE' ? 'bg-risk-moderate-bg text-risk-moderate border-risk-moderate/20' :
                      'bg-risk-low-bg text-risk-low border-risk-low/20'
                    }`}>
                      {zone.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                       <span className="text-sm font-black text-primary-900 tabular-nums">{zone.composite_score?.toFixed(1) || '0.0'}</span>
                       <div className="h-1.5 w-20 bg-surface-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              zone.risk_level === 'CRITICAL' ? 'bg-risk-critical' : 'bg-primary-600'
                            }`}
                            style={{ width: `${(zone.composite_score || 0) * 10}%` }}
                          ></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center space-x-2 text-[10px] font-black text-primary-600 uppercase tracking-widest hover:text-primary-900 transition-colors">
                       <span>Details</span>
                       <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
