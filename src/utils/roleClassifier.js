export const classifyRole = (stats) => {
  // Helpers to extract stat values easily from the PokeAPI stats array
  const getStat = (name) => stats.find(s => s.stat.name === name)?.base_stat || 0;

  const hp = getStat('hp');
  const atk = getStat('attack');
  const def = getStat('defense');
  const spa = getStat('special-attack');
  const spd = getStat('special-defense');
  const spe = getStat('speed');

  // Classification Logic based on user rules
  // Physical Sweeper: ATK > SpA AND Speed > 90
  if (atk > spa && spe > 90) return 'Physical Sweeper';

  // Special Sweeper: SpA > ATK AND Speed > 90
  if (spa > atk && spe > 90) return 'Special Sweeper';

  // Physical Tank: DEF > 90 AND HP > 80
  if (def > 90 && hp > 80) return 'Physical Tank';

  // Special Tank: SpD > 90 AND HP > 80
  if (spd > 90 && hp > 80) return 'Special Tank';

  // Mixed Attacker: ATK and SpA within 10 points of each other
  if (Math.abs(atk - spa) <= 10 && atk > 80 && spa > 80) return 'Mixed Attacker';

  // Default Fallback
  return 'Support/Utility';
};
