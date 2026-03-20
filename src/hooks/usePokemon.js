import { useState, useCallback } from 'react';

// --- In-memory cache for the active browser session
const cacheMap = {};

export const usePokemon = () => {
  // --- Request state for the selected Pokemon lookup
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Fetch Pokemon by name or ID with cache-first behavior
  const fetchPokemon = useCallback(async (nameOrId) => {
    if (!nameOrId) return;
    
    const query = typeof nameOrId === 'string' ? nameOrId.toLowerCase() : nameOrId;
    
    // --- Return cached result when available
    if (cacheMap[query]) {
      setData(cacheMap[query]);
      setError(null);
      return cacheMap[query];
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      
      if (!response.ok) {
        throw new Error('Pokémon not found');
      }
      
      const result = await response.json();
      
      // --- Save lookup result under multiple keys
      cacheMap[query] = result;
      cacheMap[result.id] = result;
      cacheMap[result.name] = result;

      setData(result);
      return result;

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchPokemon };
};
