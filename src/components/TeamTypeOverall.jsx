import React, { useMemo } from 'react';
import { getPokemonEffectiveness } from '../utils/typeAnalysis';
import { typeColors } from '../utils/typeColors';

const TYPE_ORDER = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TeamTypeOverall = ({ team }) => {
  const summary = useMemo(() => {
    const coveredAdvantages = new Set();
    const coveredResistances = new Set();

    team.forEach((pokemon) => {
      const typeNames = pokemon.types.map((t) => t.type.name);
      const { advantages, resistances } = getPokemonEffectiveness(typeNames);

      advantages.forEach((type) => {
        coveredAdvantages.add(type);
      });

      resistances.forEach(([type]) => {
        coveredResistances.add(type);
      });
    });

    return {
      noResistanceAgainst: TYPE_ORDER.filter((type) => !coveredResistances.has(type)),
      noStrengthAgainst: TYPE_ORDER.filter((type) => !coveredAdvantages.has(type))
    };
  }, [team]);

  const TypeBadge = ({ type }) => (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: `${(typeColors[type] || '#3b82f6')}cc` }}
    >
      <span>{type.substring(0, 3)}</span>
    </div>
  );

  const renderGapList = (items, clearMessage) => {
    if (items.length === 0) {
      return <span className="text-[10px] text-emerald-300/90 font-bold">{clearMessage}</span>;
    }

    return items.map((type) => (
      <TypeBadge key={type} type={type} />
    ));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">No One In Team Is Resistant Against</span>
        <div className="flex flex-wrap gap-2">
          {renderGapList(summary.noResistanceAgainst, 'No defensive resistance gaps')}
        </div>
      </div>

      <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">No One In Team Is Strong Against</span>
        <div className="flex flex-wrap gap-2">
          {renderGapList(summary.noStrengthAgainst, 'No offensive strength gaps')}
        </div>
      </div>
    </div>
  );
};

export default TeamTypeOverall;
