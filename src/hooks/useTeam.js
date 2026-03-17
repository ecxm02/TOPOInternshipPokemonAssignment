import { useState, useEffect } from 'react';

const TEAM_STORAGE_KEY = 'pokemon_team_builder_data';
const MAX_TEAM_SIZE = 6;

export const useTeam = () => {
  // Initialize from LocalStorage or empty array
  const [team, setTeam] = useState(() => {
    try {
      const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      console.error('Failed to load team from localStorage', error);
      return [];
    }
  });

  // Sync to LocalStorage whenever team changes
  useEffect(() => {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Failed to save team to localStorage', error);
    }
  }, [team]);

  const addPokemon = (pokemon) => {
    if (team.length >= MAX_TEAM_SIZE) {
      console.warn('Team is already full! Maximum is 6.');
      return;
    }
    
    // Optional: prevent duplicates if undesired. For now we assume duplicates are allowed
    // if (team.some(p => p.id === pokemon.id)) return;

    setTeam(prev => [...prev, pokemon]);
  };

  const removePokemon = (indexToRemove) => {
    // Note: If using ID, multiple of the same pokemon would all be removed.
    // Index is safer if we allow duplicate pokemon.
    setTeam(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return { team, addPokemon, removePokemon };
};
