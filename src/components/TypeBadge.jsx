import React from 'react';
import { typeColors } from '../utils/typeColors';

const TypeBadge = ({ type }) => {
  const color = typeColors[type.toLowerCase()] || '#777';

  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm border border-white/10"
      style={{
        backgroundColor: color,
        textShadow: '0px 1px 2px rgba(0,0,0,0.5)'
      }}
    >
      {type}
    </span>
  );
};

export default TypeBadge;
