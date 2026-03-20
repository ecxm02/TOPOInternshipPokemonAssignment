import React from 'react';
import PokemonCard from './PokemonCard';

const TeamSlot = ({ pokemon, index, onRemove, chartType, onExpand }) => {
  return (
    <div className="w-full h-full min-h-[400px] relative overflow-visible">
      {pokemon ? (
        <PokemonCard 
          pokemon={pokemon} 
          index={index} 
          onRemove={onRemove} 
          chartType={chartType}
          onExpand={onExpand}
        />
      ) : (
        <div className="glass-card h-full flex flex-col items-center justify-center p-8 border-dashed border-2 border-white/10 hover:border-white/30 transition-colors group cursor-default">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="white" 
              className="opacity-20 group-hover:opacity-50 transition-opacity"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-white/20 font-bold uppercase tracking-widest text-xs group-hover:text-white/40 transition-colors">
            Slot {index + 1}
          </span>
        </div>
      )}
    </div>
  );
};

export default TeamSlot;
