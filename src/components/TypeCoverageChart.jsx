import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { calculateTeamWeaknesses } from '../utils/typeMatrix';
import { typeColors } from '../utils/typeColors';

const TypeCoverageChart = ({ team }) => {
  const [weaknessData, setWeaknessData] = useState([]);

  useEffect(() => {
    const analyzeTeam = async () => {
      const results = await calculateTeamWeaknesses(team);
      
      // Transform into array for Recharts
      const data = Object.keys(typeColors).map(type => ({
        name: type,
        count: results[type]?.count || 0,
        color: typeColors[type]
      }));

      setWeaknessData(data);
    };

    analyzeTeam();
  }, [team]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const type = payload[0].payload.name;
      const count = payload[0].value;
      return (
        <div className="glass-card bg-[#0f172a]/90 p-3 border-none shadow-2xl">
          <p className="capitalize font-bold mb-1" style={{ color: typeColors[type] }}>{type}</p>
          <p className="text-white text-xs">{count} Pokémon weak to this type</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 w-full max-w-5xl mx-auto mb-12">
      <h2 className="text-xl font-bold mb-6 text-left border-l-4 border-brand-500 pl-4 uppercase tracking-tighter">
        Team Weakness Analysis
      </h2>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weaknessData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: '#ffffff60' }} 
              angle={-45} 
              textAnchor="end"
              interval={0}
              height={60}
              className="capitalize"
            />
            <YAxis tick={{ fontSize: 10, fill: '#ffffff60' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {weaknessData.map((entry, index) => {
                let barColor = entry.color;
                if (entry.count >= 3) barColor = '#ef4444'; // Red for 3+
                else if (entry.count >= 2) barColor = '#f97316'; // Orange for 2+
                
                return <Cell key={`cell-${index}`} fill={barColor} fillOpacity={0.8} stroke={barColor} strokeWidth={1} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-4 justify-start overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
          <span className="text-[10px] text-white/40 uppercase">2+ Shared Weaknesses</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500"></div>
          <span className="text-[10px] text-white/40 uppercase">3+ Critical Vulnerabilities</span>
        </div>
      </div>
    </div>
  );
};

export default TypeCoverageChart;
