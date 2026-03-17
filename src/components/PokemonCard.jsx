import React from 'react';
import TypeBadge from './TypeBadge';
import StatRadarChart from './StatRadarChart';
import { classifyRole } from '../utils/roleClassifier';
import { typeColors } from '../utils/typeColors';

const PokemonCard = ({ pokemon, onRemove, index }) => {
  if (!pokemon) return null;

  const role = classifyRole(pokemon.stats);
  const primaryType = pokemon.types[0].type.name;
  const themeColor = typeColors[primaryType] || '#3b82f6';

  // Sprite logic: Animated Gen 5 -> Official Artwork -> Default Front
  const sprite = 
    pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default ||
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="glass-card p-4 flex flex-col items-center animate-in fade-in zoom-in duration-300 relative group">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white cursor-pointer"
        title="Remove Pokemon"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Sprite */}
      <div className="h-32 flex items-center justify-center p-2 mb-2">
        <img 
          src={sprite} 
          alt={pokemon.name} 
          className="max-h-full drop-shadow-lg"
        />
      </div>

      {/* Basic Info */}
      <h3 className="capitalize text-xl font-bold mb-1 tracking-tight">{pokemon.name}</h3>
      
      <div className="flex gap-2 mb-3">
        {pokemon.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>

      {/* Role */}
      <div 
        className="px-3 py-1 rounded-lg text-[10px] font-semibold mb-2"
        style={{ backgroundColor: `${themeColor}22`, color: themeColor, border: `1px solid ${themeColor}44` }}
      >
        {role}
      </div>

      {/* Stats Chart */}
      <StatRadarChart stats={pokemon.stats} color={themeColor} />
    </div>
  );
};

export default PokemonCard;
