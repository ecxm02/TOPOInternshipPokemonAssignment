import React from 'react';

const StatBarChart = ({ stats, color }) => {
  // Map PokeAPI stats to simplified keys
  const statMap = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SPA',
    'special-defense': 'SPD',
    'speed': 'SPE'
  };

  const bst = stats.reduce((acc, s) => acc + s.base_stat, 0);
  const bstPercentage = Math.min((bst / 1530) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-1.5 py-1">
      {stats.map((s) => {
        const label = statMap[s.stat.name] || s.stat.name.toUpperCase();
        const value = s.base_stat;
        const percentage = Math.min((value / 255) * 100, 100);

        return (
          <div key={s.stat.name} className="flex items-center gap-2 group/row h-5">
            {/* Stat Name */}
            <span className="text-[15px] font-black uppercase opacity-40 w-6 text-left tracking-tighter shrink-0">{label}</span>

            {/* Progress Bar (Thicker) */}
            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
              <div
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}33`
                }}
              />
            </div>

            {/* Stat Value */}
            <span className="text-[15px] font-mono font-black opacity-60 w-6 text-right shrink-0">{value}</span>
          </div>
        );
      })}

      {/* Total BST Row */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5 h-6">
        <span className="text-[15px] font-black uppercase text-brand-400 w-6 text-left tracking-tighter shrink-0 leading-none">BST</span>

        <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden border border-brand-500/20 relative">
          <div
            className="h-full transition-all duration-1000 ease-out rounded-full bg-gradient-to-r from-brand-400 to-white shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{ width: `${bstPercentage}%` }}
          />
        </div>

        <span className="text-[15px] font-mono font-black text-brand-300 w-6 text-right shrink-0">{bst}</span>
      </div>
    </div>
  );
};

export default StatBarChart;
