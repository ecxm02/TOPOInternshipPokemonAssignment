import React, { useMemo } from 'react';

const TEAM_STAT_MAX = 255 * 6;
const TEAM_TOTAL_MAX = 1530 * 6;

const TeamStatChart = ({ team }) => {
  const summary = useMemo(() => {
    const totals = {
      hp: 0,
      attack: 0,
      defense: 0,
      'special-attack': 0,
      'special-defense': 0,
      speed: 0
    };

    team.forEach((pokemon) => {
      pokemon.stats.forEach((s) => {
        if (totals[s.stat.name] !== undefined) {
          totals[s.stat.name] += s.base_stat;
        }
      });
    });

    const statRows = [
      { name: 'HP', val: totals.hp },
      { name: 'DEF', val: totals.defense },
      { name: 'SpD', val: totals['special-defense'] },
      { name: 'SPE', val: totals.speed },
      { name: 'ATK', val: totals.attack },
      { name: 'SpA', val: totals['special-attack'] }
    ];

    const total = statRows.reduce((acc, row) => acc + row.val, 0);

    return { statRows, total };
  }, [team]);

  return (
    <div className="rounded-xl bg-black/35 border border-white/10 p-4 md:p-5 shadow-xl relative overflow-hidden mb-6">
      <div className="absolute top-0 right-0 w-44 h-44 blur-[60px] pointer-events-none -mr-20 -mt-20 bg-brand-500/10"></div>

      <div className="flex flex-col gap-3 relative z-10">
        {summary.statRows.map((row) => (
          <div key={row.name} className="flex items-center gap-2">
            <span className="w-10 text-[16px] font-black text-white/92 uppercase tracking-tighter shrink-0">{row.name}</span>
            <div className="flex-1 h-3 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((row.val / TEAM_STAT_MAX) * 100, 100)}%`,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)'
                }}
              />
            </div>
            <span className="w-14 text-[15px] font-mono font-black text-white/92 text-right shrink-0">{row.val}</span>
          </div>
        ))}

        <div className="h-px bg-white/10 my-1"></div>

        <div className="flex items-center gap-4">
          <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/92 shrink-0">TOTAL</span>
          <div className="flex-1 h-4 bg-white/8 rounded-full overflow-hidden p-px border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((summary.total / TEAM_TOTAL_MAX) * 100, 100)}%`,
                backgroundColor: 'rgba(255, 255, 255, 0.85)',
                boxShadow: '0 0 15px rgba(255, 255, 255, 0.45)'
              }}
            />
          </div>
          <span className="text-[18px] font-mono font-black text-white/92 shrink-0">{summary.total}</span>
        </div>
      </div>
    </div>
  );
};

export default TeamStatChart;
