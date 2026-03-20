import React, { useMemo } from 'react';
import { classifyRole } from '../../utils/roleClassifier';

const ROLE_COLUMNS = [
  {
    key: 'physical-sweeper',
    title: 'Physical Sweeper',
    tone: { bg: '#ef444433', border: '#ef444488', text: '#fecaca' },
    accepts: (role) => role === 'Physical Sweeper'
  },
  {
    key: 'special-sweeper',
    title: 'Special Sweeper',
    tone: { bg: '#ef444433', border: '#ef444488', text: '#fecaca' },
    accepts: (role) => role === 'Special Sweeper'
  },
  {
    key: 'tank',
    title: 'Tank',
    tone: { bg: '#3b82f633', border: '#3b82f688', text: '#bfdbfe' },
    accepts: (role) => role === 'Physical Tank' || role === 'Special Tank'
  },
  {
    key: 'mixed-attacker',
    title: 'Mixed Attacker',
    tone: { bg: '#f59e0b33', border: '#f59e0b88', text: '#fde68a' },
    accepts: (role) => role === 'Mixed Attacker'
  },
  {
    key: 'support',
    title: 'Support/Utility',
    tone: { bg: '#10b98133', border: '#10b98188', text: '#a7f3d0' },
    accepts: (role) => role === 'Support/Utility'
  }
];

const TeamRoleColumns = ({ team }) => {
  // --- Group current team members into role buckets
  const grouped = useMemo(() => {
    const byColumn = ROLE_COLUMNS.map((column) => ({ ...column, pokemons: [] }));

    team.forEach((pokemon) => {
      const role = classifyRole(pokemon.stats);
      const target = byColumn.find((column) => column.accepts(role));
      if (target) {
        target.pokemons.push(pokemon);
      }
    });

    return byColumn;
  }, [team]);

  // --- Prefer animated sprite, then fallback to static art
  const getSprite = (pokemon) => (
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
    || pokemon.sprites.front_default
    || pokemon.sprites.other?.['official-artwork']?.front_default
  );

  return (
    // --- Render one column per role class
    <div className="rounded-xl bg-black/35 border border-white/10 p-4 md:p-5 mb-6">
      <h3 className="text-[11px] font-black uppercase tracking-[0.28em] text-white/85 mb-4 text-center">Role Distribution</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {grouped.map((column) => (
          <div key={column.key} className="rounded-lg bg-black/25 border border-white/10 p-3 flex flex-col gap-2">
            <div className="flex justify-center">
              <span
                className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.12em]"
                style={{
                  backgroundColor: column.tone.bg,
                  border: `1px solid ${column.tone.border}`,
                  color: column.tone.text
                }}
              >
                {column.title}
              </span>
            </div>

            {column.pokemons.length > 0 ? (
              <div className="flex flex-col items-center gap-2 min-h-[56px]">
                {column.pokemons.map((pokemon) => {
                  const sprite = getSprite(pokemon);
                  return (
                    <div
                      key={`${column.key}-${pokemon.name}`}
                      className="w-[72px] h-[72px] flex items-center justify-center"
                      title={`${pokemon.name} (${classifyRole(pokemon.stats)})`}
                    >
                      {sprite ? (
                        <img
                          src={sprite}
                          alt={pokemon.name}
                          className="w-[72px] h-[72px] object-contain pixelated drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
                        />
                      ) : (
                        <span className="text-[8px] text-white/40">N/A</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-[10px] text-white/35 italic text-center py-2">None</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRoleColumns;
