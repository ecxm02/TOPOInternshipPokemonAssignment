import { TYPE_DATA } from './typeData';

export const getPokemonEffectiveness = (types) => {
  // --- Aggregate outgoing and incoming multipliers for dual-type Pokemon
  const defensiveMultipliers = {};
  const offensiveAdvantages = new Set();
  const offensiveDisadvantages = new Set();

  types.forEach(typeName => {
    const data = TYPE_DATA[typeName.toLowerCase()];
    if (!data) return;
    
    // --- Defensive multipliers (incoming damage)
    data.double.forEach(t => defensiveMultipliers[t] = (defensiveMultipliers[t] || 1) * 2);
    data.half.forEach(t => defensiveMultipliers[t] = (defensiveMultipliers[t] || 1) * 0.5);
    data.no.forEach(t => defensiveMultipliers[t] = 0);

    // --- Offensive multipliers (outgoing damage)
    Object.entries(TYPE_DATA).forEach(([targetType, targetData]) => {
      if (targetData.double.includes(typeName.toLowerCase())) {
        offensiveAdvantages.add(targetType);
      }

      if (targetData.half.includes(typeName.toLowerCase()) || targetData.no.includes(typeName.toLowerCase())) {
        offensiveDisadvantages.add(targetType);
      }
    });
  });

  // --- Favor advantages over disadvantages when any STAB type can hit effectively
  offensiveAdvantages.forEach((targetType) => offensiveDisadvantages.delete(targetType));

  const results = Object.entries(defensiveMultipliers).filter(([, m]) => m !== 1);
  return {
    weaknesses: results.filter(([, m]) => m > 1).sort((a,b) => b[1] - a[1]),
    resistances: results.filter(([, m]) => m < 1).sort((a,b) => a[1] - b[1]),
    advantages: Array.from(offensiveAdvantages).sort(), // Types we hit for 2x
    disadvantages: Array.from(offensiveDisadvantages).sort() // Types we hit for <= 0.5x
  };
};
