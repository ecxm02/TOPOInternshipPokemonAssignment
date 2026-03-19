import React from 'react';
import TypeBadge from './TypeBadge';
import StatRadarChart from './StatRadarChart';
import StatBarChart from './StatBarChart';
import { classifyRole } from '../utils/roleClassifier';
import { typeColors } from '../utils/typeColors';
import { getPokemonEffectiveness } from '../utils/typeAnalysis';

const MiniBadge = ({ type, multiplier }) => {
  const color = typeColors[type] || '#3b82f6';
  const label = multiplier > 1 ? `${multiplier}x` : (multiplier === 0 ? '0' : '½');

  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: `${color}cc` }}
    >
      <span>{type.substring(0, 3)}</span>
    </div>
  );
};

const PokemonCard = ({ pokemon, onRemove, index, chartType }) => {
  if (!pokemon) return null;

  const role = classifyRole(pokemon.stats);
  const primaryType = pokemon.types[0].type.name;
  const themeColor = typeColors[primaryType] || '#3b82f6';
  const { weaknesses, resistances } = getPokemonEffectiveness(pokemon.types.map(t => t.type.name));

  const animatedSprite = pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemon.sprites.front_default;
  const officialPhoto = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;

  return (
    <div className="glass-card p-5 animate-in fade-in zoom-in duration-300 relative group overflow-hidden flex flex-col gap-4 hover:scale-[1.05] transition-all duration-300 ease-out hover:shadow-2xl">
      {/* Top Section: Identity */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="capitalize text-lg font-black tracking-tight whitespace-nowrap">{pokemon.name}</h3>
          <img src={animatedSprite} alt="sprite" className="w-8 h-8 object-contain pixelated" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {pokemon.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </div>
          <button
            onClick={() => onRemove(index)}
            className="p-1 rounded-md bg-white/5 text-white/20 hover:bg-red-500/20 hover:text-red-500 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Body: 2-2-1 Grid Refactor */}
      <div className="flex flex-col gap-6">
        {/* Row 1: Photo LEFT (25%) | Type Analysis RIGHT (75%) */}
        <div className="grid grid-cols-[1fr_3fr] gap-4 items-center">
          <div className="flex justify-center relative">
            <div className="absolute inset-0 rounded-full blur-[40px] opacity-30 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
            <img src={officialPhoto} alt={pokemon.name} className="max-h-24 max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] relative z-10 hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-black/30 border border-white/10 shadow-inner">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">⚔️ DEALS EXTRA DAMAGE TO</span>
                <div className="flex flex-wrap gap-1.5">
                  {getPokemonEffectiveness(pokemon.types.map(t => t.type.name)).advantages.length > 0 ? (
                    getPokemonEffectiveness(pokemon.types.map(t => t.type.name)).advantages.map(type => (
                      <MiniBadge key={type} type={type} multiplier={2} />
                    ))
                  ) : <span className="text-[8px] opacity-20 italic">None</span>}
                </div>
              </div>
              <div className="h-px bg-white/5 my-0.5"></div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">💀 TAKES EXTRA DAMAGE FROM</span>
                <div className="flex flex-wrap gap-1.5">
                  {weaknesses.length > 0 ? weaknesses.map(([type, mult]) => (
                    <MiniBadge key={type} type={type} multiplier={mult} />
                  )) : <span className="text-[8px] opacity-20 italic">None</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Stats & BST Container */}
        <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/10 shadow-xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[50px] pointer-events-none -mr-16 -mt-16"></div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            {/* Defensive Block */}
            <div className="flex flex-col gap-3">
              {[
                { name: 'HP', val: pokemon.stats[0].base_stat, max: 255 },
                { name: 'DEF', val: pokemon.stats[2].base_stat, max: 230 },
                { name: 'SpD', val: pokemon.stats[4].base_stat, max: 230 }
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-7 text-[15px] font-black text-white/40 uppercase tracking-tighter shrink-0">{s.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(s.val / s.max) * 100}%`, backgroundColor: themeColor }} />
                  </div>
                  <span className="w-6 text-[15px] font-mono font-black text-right shrink-0" style={{ color: themeColor }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Offensive & Speed Block */}
            <div className="flex flex-col gap-3">
              {[
                { name: 'SPE', val: pokemon.stats[5].base_stat, max: 200 },
                { name: 'ATK', val: pokemon.stats[1].base_stat, max: 190 },
                { name: 'SpA', val: pokemon.stats[3].base_stat, max: 194 }
              ].map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-7 text-[15px] font-black text-white/40 uppercase tracking-tighter shrink-0">{s.name}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(s.val / s.max) * 100}%`, backgroundColor: themeColor }} />
                  </div>
                  <span className="w-6 text-[15px] font-mono font-black text-right shrink-0" style={{ color: themeColor }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="h-px bg-white/10 -mx-10"></div>

          {/* Final Row */}
          <div className="flex flex-col gap-1.5 relative z-10">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-400 shrink-0">TOTAL</span>
              <div className="flex-1 h-4 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5 relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.min((pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0) / 780) * 100, 100)}%` }}
                />
              </div>
              <span className="text-sm font-mono font-black text-brand-300 shrink-0">
                {pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
