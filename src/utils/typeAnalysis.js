import { TYPE_DATA } from './typeData';

export const getPokemonEffectiveness = (types) => {
  const defensiveMultipliers = {};
  const offensiveAdvantages = new Set();
  
  types.forEach(typeName => {
    const data = TYPE_DATA[typeName.toLowerCase()];
    if (!data) return;
    
    // Defensive Logic (Incoming damage)
    data.double.forEach(t => defensiveMultipliers[t] = (defensiveMultipliers[t] || 1) * 2);
    data.half.forEach(t => defensiveMultipliers[t] = (defensiveMultipliers[t] || 1) * 0.5);
    data.no.forEach(t => defensiveMultipliers[t] = 0);

    // Offensive Logic (Outgoing damage)
    // We can derive this from TYPE_DATA by checking which types are weak to our current type
    Object.entries(TYPE_DATA).forEach(([targetType, targetData]) => {
      if (targetData.double.includes(typeName.toLowerCase())) {
        offensiveAdvantages.add(targetType);
      }
    });
  });
  
  const results = Object.entries(defensiveMultipliers).filter(([_, m]) => m !== 1);
  return {
    weaknesses: results.filter(([_, m]) => m > 1).sort((a,b) => b[1] - a[1]),
    resistances: results.filter(([_, m]) => m < 1).sort((a,b) => a[1] - b[1]),
    advantages: Array.from(offensiveAdvantages).sort() // Types we hit for 2x
  };
};
