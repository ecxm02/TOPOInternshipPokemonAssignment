import React from 'react';
import TeamSlot from './TeamSlot';

const TeamGrid = ({ team, onRemove, onExpand }) => {
  // Ensure we always show 6 slots
  const slots = Array(6).fill(null);
  team.forEach((p, i) => {
    slots[i] = p;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 py-8 overflow-visible">
      {slots.map((pokemon, index) => (
        <TeamSlot 
          key={index} 
          index={index} 
          pokemon={pokemon} 
          onRemove={onRemove} 
          onExpand={onExpand}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
