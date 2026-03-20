export const classifyRole = (stats) => {
  // --- Helper for looking up specific stat values
  const getStat = (name) => stats.find(s => s.stat.name === name)?.base_stat || 0;

  const hp = getStat('hp');
  const atk = getStat('attack');
  const def = getStat('defense');
  const spa = getStat('special-attack');
  const spd = getStat('special-defense');
  const spe = getStat('speed');

  // --- Role rules
  if (atk > spa && spe > 90) return 'Physical Sweeper';

  if (spa > atk && spe > 90) return 'Special Sweeper';

  if (def > 90 && hp > 80) return 'Physical Tank';

  if (spd > 90 && hp > 80) return 'Special Tank';

  if (Math.abs(atk - spa) <= 10 && atk > 80 && spa > 80) return 'Mixed Attacker';

  // --- Default fallback
  return 'Support/Utility';
};
