import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'teal' | 'gold' | 'orange' | 'red' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = 'orange' 
}) => {
  const colorMap = {
    teal: 'text-primary-700 bg-primary-50',
    gold: 'text-risk-moderate bg-risk-moderate-bg',
    orange: 'text-primary-600 bg-primary-50',
    red: 'text-risk-critical bg-risk-critical-bg',
    blue: 'text-blue-700 bg-blue-50'
  };

  return (
    <div className="bg-surface-white border border-surface-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        <Icon size={80} />
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
            <p className="text-[10px] font-black text-text-400 uppercase tracking-[0.15em]">{title}</p>
          </div>
          <h3 className="text-3xl font-black text-primary-950 tracking-tighter tabular-nums">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]} shadow-sm border border-black/5`}>
          <Icon size={22} />
        </div>
      </div>
      
      <div className="mt-5 flex items-center justify-between relative z-10">
        {trend ? (
          <div className="flex items-center space-x-1.5">
            <div className={`p-0.5 rounded-full ${trend === 'up' ? 'bg-risk-critical-bg' : 'bg-risk-low-bg'}`}>
              {trend === 'up' && <TrendingUp size={12} className="text-risk-critical" />}
              {trend === 'down' && <TrendingDown size={12} className="text-risk-low" />}
            </div>
            <span className={`text-[12px] font-black ${
              trend === 'up' ? 'text-risk-critical' : 'text-risk-low'
            }`}>
              {trendValue}
            </span>
          </div>
        ) : <div />}
        
        <div className="px-2 py-0.5 rounded bg-surface-50 border border-surface-100 flex items-center space-x-1">
           <div className="h-1 w-1 rounded-full bg-text-400"></div>
           <span className="text-[9px] font-bold text-text-400 uppercase tracking-tighter">Verified Record</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
