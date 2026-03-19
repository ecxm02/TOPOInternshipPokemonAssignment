import React, { useState, useEffect } from 'react';

const StaticBackground = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Generate 5 rows of static high-res Pokemon
    const newRows = Array.from({ length: 5 }, (_, rowIndex) => {
      const pokemonCount = 10; // Fewer images for a cleaner static look
      const pokemonIds = Array.from({ length: pokemonCount }, () => Math.floor(Math.random() * 649) + 1);
      
      return {
        id: rowIndex,
        top: `${rowIndex * 20}%`, 
        pokemon: pokemonIds.map(id => ({
          id,
          url: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
        }))
      };
    });

    setRows(newRows);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-15">
      {rows.map((row, rowIndex) => (
        <div 
          key={row.id} 
          className="absolute w-full h-44 flex items-center justify-around"
          style={{ 
            top: row.top,
            paddingLeft: rowIndex % 2 === 1 ? '5%' : '0%',
            paddingRight: rowIndex % 2 === 1 ? '0%' : '5%'
          }}
        >
          {row.pokemon.map((p, i) => (
            <img
              key={`${p.id}-${row.id}-${i}`}
              src={p.url}
              alt=""
              className="w-32 h-32 object-contain pixelated"
              onError={(e) => { e.target.style.visibility = 'hidden'; }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default StaticBackground;
