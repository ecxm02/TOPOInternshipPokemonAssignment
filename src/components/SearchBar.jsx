import React, { useState, useEffect, useRef } from 'react';
import { usePokemon } from '../hooks/usePokemon';

const SearchBar = ({ onAdd, teamSize }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { data, loading, error, fetchPokemon } = usePokemon();
  const dropdownRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    if (!query.trim()) {
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchPokemon(query.toLowerCase());
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchPokemon]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = () => {
    if (data && teamSize < 6) {
      onAdd(data);
      setQuery('');
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto mb-12 px-4">
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a Pokémon... (e.g. Lucario)"
          className="w-full glass-card bg-white/5 border-white/10 hover:border-white/20 focus:border-brand-500 py-4 px-6 text-white placeholder-white/30 outline-none transition-all"
        />
        
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {showDropdown && (query || data || error) && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 left-4 right-4 mt-2 glass-card bg-[#1e293b]/95 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {loading ? (
            <div className="p-4 text-center text-white/40 text-sm">Searching...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-400 text-sm">Pokémon not found</div>
          ) : data ? (
            <button
              onClick={handleSelect}
              disabled={teamSize >= 6}
              className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src={data.sprites.front_default} 
                alt={data.name} 
                className="w-12 h-12 pixelated" 
              />
              <div className="flex-1">
                <p className="capitalize font-bold text-white">{data.name}</p>
                <p className="text-white/40 text-xs">#{String(data.id).padStart(3, '0')}</p>
              </div>
              <div className="text-brand-500 font-bold text-sm">
                {teamSize >= 6 ? 'Team Full' : '+ Add to Team'}
              </div>
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
