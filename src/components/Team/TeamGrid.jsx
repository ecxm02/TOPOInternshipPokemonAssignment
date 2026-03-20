import React from 'react';
import TeamSlot from './TeamSlot';

const TeamGrid = ({ team, onRemove, onExpand, onRequestAdd }) => {
  // --- Always render a fixed six-slot team layout
  const slots = Array(6).fill(null);
  team.forEach((p, i) => {
    slots[i] = p;
  });

  return (
    // --- Map normalized slots into TeamSlot cards
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4 py-8 overflow-visible">
      {slots.map((pokemon, index) => (
        <TeamSlot 
          key={index} 
          index={index} 
          pokemon={pokemon} 
          onRemove={onRemove} 
          onExpand={onExpand}
          onRequestAdd={onRequestAdd}
        />
      ))}
    </div>
  );
};

export default TeamGrid;
