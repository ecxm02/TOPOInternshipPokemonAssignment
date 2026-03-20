const normalize = (value) => (value || '').toLowerCase().trim();

const levenshteinDistance = (a, b) => {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
};

const subsequenceGapScore = (target, query) => {
  let targetIndex = 0;
  let gaps = 0;

  for (let i = 0; i < query.length; i += 1) {
    const charIndex = target.indexOf(query[i], targetIndex);
    if (charIndex === -1) return Number.POSITIVE_INFINITY;

    gaps += charIndex - targetIndex;
    targetIndex = charIndex + 1;
  }

  return gaps;
};

const getMatchScore = (pokemon, rawQuery) => {
  const query = normalize(rawQuery);
  const name = normalize(pokemon.name);
  const idString = String(pokemon.id);

  if (!query) return Number.POSITIVE_INFINITY;

  if (/^\d+$/.test(query)) {
    if (idString === query) return 0;
    if (idString.startsWith(query)) return 1 + (idString.length - query.length) * 0.01;
  }

  if (name === query) return 0;
  if (name.startsWith(query)) return 1 + (name.length - query.length) * 0.01;

  const includesIndex = name.indexOf(query);
  if (includesIndex >= 0) return 2 + includesIndex * 0.01;

  const gapScore = subsequenceGapScore(name, query);
  if (Number.isFinite(gapScore)) return 3 + gapScore * 0.02;

  const distance = levenshteinDistance(name, query);
  const maxDistance = Math.max(2, Math.ceil(query.length * 0.4));
  if (distance <= maxDistance) return 4 + distance;

  return Number.POSITIVE_INFINITY;
};

export const rankPokemonMatches = (pokemonList, query, limit = 8) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery || !Array.isArray(pokemonList) || pokemonList.length === 0) {
    return [];
  }

  return pokemonList
    .map((pokemon) => ({
      ...pokemon,
      score: getMatchScore(pokemon, normalizedQuery)
    }))
    .filter((pokemon) => Number.isFinite(pokemon.score))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      if (a.name.length !== b.name.length) return a.name.length - b.name.length;
      return a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map((pokemon) => ({ id: pokemon.id, name: pokemon.name }));
};

