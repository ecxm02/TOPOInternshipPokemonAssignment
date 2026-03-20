import { useEffect, useState } from 'react';

const INDEX_STORAGE_KEY = 'pokemon-index-v1';
const INDEX_API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0';

let memoryIndex = null;
let pendingIndexRequest = null;

const parsePokemonIdFromUrl = (url) => {
  const segments = url.split('/').filter(Boolean);
  return Number(segments[segments.length - 1]);
};

const loadFromStorage = () => {
  try {
    const raw = window.localStorage.getItem(INDEX_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    return parsed;
  } catch {
    return null;
  }
};

const saveToStorage = (index) => {
  try {
    window.localStorage.setItem(INDEX_STORAGE_KEY, JSON.stringify(index));
  } catch {
    // Ignore storage write failures.
  }
};

const fetchPokemonIndex = async () => {
  if (memoryIndex) return memoryIndex;

  const fromStorage = loadFromStorage();
  if (fromStorage?.length) {
    memoryIndex = fromStorage;
    return memoryIndex;
  }

  if (!pendingIndexRequest) {
    pendingIndexRequest = fetch(INDEX_API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load Pokemon search index');
        }
        return response.json();
      })
      .then((payload) => {
        const index = payload.results.map((entry) => ({
          id: parsePokemonIdFromUrl(entry.url),
          name: entry.name
        }));

        memoryIndex = index;
        saveToStorage(index);
        return index;
      })
      .finally(() => {
        pendingIndexRequest = null;
      });
  }

  return pendingIndexRequest;
};

export const usePokemonIndex = () => {
  const [pokemonIndex, setPokemonIndex] = useState(memoryIndex || []);
  const [loading, setLoading] = useState(!memoryIndex);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
        const index = await fetchPokemonIndex();
        if (!isMounted) return;
        setPokemonIndex(index);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Unable to load search index');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  return { pokemonIndex, loading, error };
};

