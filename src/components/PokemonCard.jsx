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
      className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm"
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
    <div className="glass-card p-5 animate-in fade-in zoom-in duration-300 relative group overflow-hidden flex flex-col gap-4">
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

      {/* Main Body: Grid Split */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Side: Photo + Role + Analysis */}
        <div className="flex flex-col gap-4 h-full">
          <div className="h-44 w-full flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500 shrink-0">
            <div className="absolute inset-x-0 inset-y-4 rounded-full blur-[60px] opacity-40 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
            <img src={officialPhoto} alt={pokemon.name} className="max-h-full max-w-full object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative z-10" />
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <div 
                className="px-4 py-1 rounded-md text-[10px] font-black tracking-[0.2em] uppercase shadow-xl border-t border-white/10"
                style={{ backgroundColor: `${themeColor}22`, color: themeColor, borderColor: `${themeColor}44` }}
              >
                {role}
              </div>
            </div>

            {/* Tactical Type Analysis */}
            <div className="flex flex-col gap-2 p-2 rounded-lg bg-black/20 border border-white/5">
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-red-500 uppercase tracking-widest pl-0.5">Weaknesses</span>
                <div className="flex flex-wrap gap-1">
                  {weaknesses.length > 0 ? weaknesses.map(([type, mult]) => (
                    <MiniBadge key={type} type={type} multiplier={mult} />
                  )) : <span className="text-[7px] opacity-30 italic">None</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[7px] font-black text-green-500 uppercase tracking-widest pl-0.5">Resistances</span>
                <div className="flex flex-wrap gap-1">
                  {resistances.length > 0 ? resistances.map(([type, mult]) => (
                    <MiniBadge key={type} type={type} multiplier={mult} />
                  )) : <span className="text-[7px] opacity-30 italic">None</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Charts */}
        <div className="flex flex-col justify-center">
          <div className="w-full max-w-[200px] mx-auto">
            {chartType === 'bar' ? (
              <StatBarChart stats={pokemon.stats} color={themeColor} />
            ) : (
              <StatRadarChart stats={pokemon.stats} color={themeColor} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
