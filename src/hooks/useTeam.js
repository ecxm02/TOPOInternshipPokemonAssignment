import { useState, useEffect } from 'react';

const TEAM_STORAGE_KEY = 'pokemon_team_builder_data';
const MAX_TEAM_SIZE = 6;

export const useTeam = () => {
  // --- Initialize team state from localStorage
  const [team, setTeam] = useState(() => {
    try {
      const savedTeam = localStorage.getItem(TEAM_STORAGE_KEY);
      return savedTeam ? JSON.parse(savedTeam) : [];
    } catch (error) {
      console.error('Failed to load team from localStorage', error);
      return [];
    }
  });

  // --- Persist team updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    } catch (error) {
      console.error('Failed to save team to localStorage', error);
    }
  }, [team]);

  // --- Add one Pokemon while enforcing the team size limit
  const addPokemon = (pokemon) => {
    if (team.length >= MAX_TEAM_SIZE) {
      console.warn('Team is already full! Maximum is 6.');
      return;
    }
    
    // --- Duplicate Pokemon are allowed by design
    // if (team.some(p => p.id === pokemon.id)) return;

    setTeam(prev => [...prev, pokemon]);
  };

  // --- Remove one Pokemon by slot index
  const removePokemon = (indexToRemove) => {
    // --- Index-based removal keeps duplicate species entries independent
    setTeam(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return { team, addPokemon, removePokemon };
};
