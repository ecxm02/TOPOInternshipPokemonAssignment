import { TYPE_DATA } from './typeData';

export const getPokemonEffectiveness = (types) => {
  const multipliers = {};
  
  types.forEach(typeName => {
    const data = TYPE_DATA[typeName.toLowerCase()];
    if (!data) return;
    
    data.double.forEach(t => multipliers[t] = (multipliers[t] || 1) * 2);
    data.half.forEach(t => multipliers[t] = (multipliers[t] || 1) * 0.5);
    data.no.forEach(t => multipliers[t] = 0);
  });
  
  const results = Object.entries(multipliers).filter(([_, m]) => m !== 1);
  return {
    weaknesses: results.filter(([_, m]) => m > 1).sort((a,b) => b[1] - a[1]),
    resistances: results.filter(([_, m]) => m < 1).sort((a,b) => a[1] - b[1])
  };
};
