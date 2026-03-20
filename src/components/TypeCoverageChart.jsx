import React, { useMemo } from 'react';
import { getPokemonEffectiveness } from '../utils/typeAnalysis';
import { typeColors } from '../utils/typeColors';

const TYPE_ORDER = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TypeCoverageChart = ({ team }) => {
  const sections = useMemo(() => {
    const perPokemon = team.map((pokemon) => {
      const typeNames = pokemon.types.map((t) => t.type.name);
      const { advantages, disadvantages, weaknesses, resistances } = getPokemonEffectiveness(typeNames);

      return {
        pokemon,
        sets: {
          advantages: new Set(advantages),
          disadvantages: new Set(disadvantages),
          weaknesses: new Set(weaknesses.map(([type]) => type)),
          resistances: new Set(resistances.map(([type]) => type))
        }
      };
    });

    const buildSection = (title, key) => {
      const typeCounts = {};

      perPokemon.forEach(({ sets }) => {
        sets[key].forEach((type) => {
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
      });

      const columns = TYPE_ORDER.map((type) => ({
        type,
        count: typeCounts[type] || 0,
        pokemons: perPokemon
          .filter(({ sets }) => sets[key].has(type))
          .map(({ pokemon }) => pokemon)
      }));

      return {
        title,
        key,
        columns
      };
    };

    return [
      buildSection('Deals Extra Damage To', 'advantages'),
      buildSection('Deals Less Damage To', 'disadvantages'),
      buildSection('Takes Extra Damage From', 'weaknesses'),
      buildSection('Takes Less Damage From', 'resistances')
    ];
  }, [team]);

  const getSprite = (pokemon) => (
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default
    || pokemon.sprites.front_default
    || pokemon.sprites.other?.['official-artwork']?.front_default
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      {sections.map((section) => (
        <div key={section.key} className="rounded-xl bg-black/35 border border-white/10 p-4 flex flex-col gap-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 text-center">{section.title}</span>

          {section.columns.length > 0 ? (
            <div className="overflow-x-auto">
              <div className="w-full flex justify-center">
                <div className="min-w-max p-3">
                <div className="flex items-end gap-2">
                  {section.columns.map((column) => (
                    <div key={`${section.key}-${column.type}`} className="w-14 flex flex-col items-center gap-1.5">
                      <div className="flex flex-col-reverse gap-1 items-center min-h-[56px]">
                        {column.pokemons.map((pokemon) => {
                          const sprite = getSprite(pokemon);
                          return (
                            <div
                              key={`${section.key}-${column.type}-${pokemon.name}`}
                              className="w-11 h-11 flex items-center justify-center"
                              title={pokemon.name}
                            >
                              {sprite ? (
                                <img src={sprite} alt={pokemon.name} className="w-10 h-10 object-contain pixelated drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]" />
                              ) : (
                                <span className="text-[8px] text-white/40">N/A</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <span
                        className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wide text-white whitespace-nowrap"
                        style={{ backgroundColor: `${(typeColors[column.type] || '#3b82f6')}cc` }}
                        title={`${column.count} / ${team.length}`}
                      >
                        {column.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-white/40 italic py-4">None</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TypeCoverageChart;
