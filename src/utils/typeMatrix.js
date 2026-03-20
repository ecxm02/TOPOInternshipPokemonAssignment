import { TYPE_DATA } from './typeData';

export const calculateTeamWeaknesses = async (team) => {
  // --- Track how many team members are weak to each attack type
  const weaknesses = {};

  for (const pokemon of team) {
    if (!pokemon) continue;

    const types = pokemon.types.map(t => t.type.name);
    const pokemonDamageMultipliers = {};

    for (const typeName of types) {
      const data = TYPE_DATA[typeName.toLowerCase()];
      if (!data) continue;

      // --- Double damage from
      data.double.forEach(t => {
        pokemonDamageMultipliers[t] = (pokemonDamageMultipliers[t] || 1) * 2;
      });

      // --- Half damage from
      data.half.forEach(t => {
        pokemonDamageMultipliers[t] = (pokemonDamageMultipliers[t] || 1) * 0.5;
      });

      // --- No damage from
      data.no.forEach(t => {
        pokemonDamageMultipliers[t] = 0;
      });
    }

    // --- Record attack types that deal super-effective damage
    Object.entries(pokemonDamageMultipliers).forEach(([attackType, multiplier]) => {
      if (multiplier > 1) {
        if (!weaknesses[attackType]) {
          weaknesses[attackType] = { count: 0, pokemon: [] };
        }
        weaknesses[attackType].count += 1;
        weaknesses[attackType].pokemon.push({ name: pokemon.name, multiplier });
      }
    });
  }

  return weaknesses;
};
