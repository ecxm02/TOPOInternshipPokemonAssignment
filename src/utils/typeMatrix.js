export const calculateTeamWeaknesses = async (team) => {
  const weaknesses = {};

  // For each Pokemon in the team
  for (const pokemon of team) {
    if (!pokemon) continue;

    // A Pokemon can have 1 or 2 types
    const types = pokemon.types.map(t => t.type.name);
    
    // We need to calculate the combined effectiveness for this specific Pokemon
    const pokemonDamageMultipliers = {};

    for (const typeName of types) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const data = await response.json();
        const damageRelations = data.damage_relations;

        // Double damage from
        damageRelations.double_damage_from.forEach(t => {
          pokemonDamageMultipliers[t.name] = (pokemonDamageMultipliers[t.name] || 1) * 2;
        });

        // Half damage from
        damageRelations.half_damage_from.forEach(t => {
          pokemonDamageMultipliers[t.name] = (pokemonDamageMultipliers[t.name] || 1) * 0.5;
        });

        // No damage from
        damageRelations.no_damage_from.forEach(t => {
          pokemonDamageMultipliers[t.name] = (pokemonDamageMultipliers[t.name] || 1) * 0;
        });

      } catch (error) {
        console.error(`Failed to fetch type data for ${typeName}:`, error);
      }
    }

    // Now check which types do > 1x damage to THIS Pokemon
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
