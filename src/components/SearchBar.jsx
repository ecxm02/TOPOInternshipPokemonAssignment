import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePokemon } from '../hooks/usePokemon';
import { usePokemonIndex } from '../hooks/usePokemonIndex';
import { rankPokemonMatches } from '../utils/fuzzySearch';

const SearchBar = ({ onAdd, teamSize, focusSignal = 0 }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const { loading: pokemonLoading, error: pokemonError, fetchPokemon } = usePokemon();
  const { pokemonIndex, loading: indexLoading, error: indexError } = usePokemonIndex();
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim().toLowerCase());
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const suggestions = useMemo(
    () => rankPokemonMatches(pokemonIndex, debouncedQuery, 8),
    [pokemonIndex, debouncedQuery]
  );

  const showDropdown = isFocused && query.trim().length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!focusSignal) return;

    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    inputRef.current?.focus();
    setIsFocused(true);
  }, [focusSignal]);

  const handleSelect = async (nameOrId) => {
    if (teamSize >= 6) return;

    setIsSelecting(true);
    const selected = await fetchPokemon(nameOrId);
    setIsSelecting(false);

    if (selected) {
      onAdd(selected);
      setQuery('');
      setDebouncedQuery('');
      setIsFocused(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto mb-12 px-4">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search for a Pokémon... (e.g. Lucario)"
          className="w-full glass-card bg-white/5 border-white/10 hover:border-white/20 focus:border-brand-500 py-4 px-6 text-white placeholder-white/30 outline-none transition-all"
        />
        
        {(pokemonLoading || isSelecting) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showDropdown && (
        <div 
          className="absolute z-50 left-4 right-4 mt-2 glass-card bg-[#1e293b]/95 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {indexLoading ? (
            <div className="p-4 text-center text-white/40 text-sm">Loading Pokemon list...</div>
          ) : indexError ? (
            <div className="p-4 text-center text-red-400 text-sm">{indexError}</div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-white/40 text-sm">No close matches</div>
          ) : (
            suggestions.map((match) => (
              <button
                key={match.id}
                onClick={() => handleSelect(match.name)}
                disabled={teamSize >= 6 || isSelecting || pokemonLoading}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-black">
                  #{String(match.id).padStart(4, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="capitalize font-bold text-white truncate">{match.name}</p>
                  <p className="text-white/40 text-xs">ID {match.id}</p>
                </div>
                <div className="text-brand-500 font-bold text-sm whitespace-nowrap">
                  {teamSize >= 6 ? 'Team Full' : '+ Add'}
                </div>
              </button>
            ))
          )}

          {pokemonError && (
            <div className="px-4 pb-3 text-red-400 text-xs">{pokemonError}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
