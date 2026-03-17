import { useState, useRef, useCallback } from 'react';

// Cache in memory for this session
const cacheMap = {};

export const usePokemon = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemon = useCallback(async (nameOrId) => {
    if (!nameOrId) return;
    
    const query = typeof nameOrId === 'string' ? nameOrId.toLowerCase() : nameOrId;
    
    // Check Cache First
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
      
      // Save to Cache
      cacheMap[query] = result;
      // Also cache by both name and ID
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
