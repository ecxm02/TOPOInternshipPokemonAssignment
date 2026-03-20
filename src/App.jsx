import React, { useState } from 'react';
import { useTeam } from './hooks/useTeam';
import SearchBar from './components/SearchBar';
import TeamGrid from './components/TeamGrid';
import TypeCoverageChart from './components/TypeCoverageChart';
import RecommendationPanel from './components/RecommendationPanel';
import StaticBackground from './components/AnimatedBackground';
import PokemonCardModal from './components/PokemonCardModal';

const App = () => {
  const { team, addPokemon, removePokemon } = useTeam();
  const [chartType, setChartType] = useState('web');
  const [expandedPokemon, setExpandedPokemon] = useState(null);

  const openExpandedPokemon = (pokemon) => setExpandedPokemon(pokemon);
  const closeExpandedPokemon = () => setExpandedPokemon(null);

  return (
    <div className="min-h-screen text-slate-200 font-inter selection:bg-brand-500/30 relative">
      <StaticBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="py-12 px-4 text-center">
          <h1 className="logo text-3xl md:text-5xl mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600 drop-shadow-sm">
            POKÉMON TEAM BUILDER
          </h1>
        </header>

        <main className="container mx-auto pb-20">
          {/* Search Section */}
          <section className="mb-8">
            <SearchBar onAdd={addPokemon} teamSize={team.length} />
          </section>

          {/* Team Grid Section */}
          <section className="mb-16">
            <div className="px-4 mb-4 flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/60 text-left">Your Active Party</h2>
                <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 gap-1 w-fit">
                  <button 
                    onClick={() => setChartType('web')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${chartType === 'web' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                  >
                    Web
                  </button>
                  <button 
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${chartType === 'bar' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                  >
                    Bar
                  </button>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/20">{team.length} / 6</span>
            </div>
            <TeamGrid
              team={team}
              onRemove={removePokemon}
              chartType={chartType}
              onExpand={openExpandedPokemon}
            />
          </section>

          {/* Analysis Section */}
          {team.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <TypeCoverageChart team={team} />
                <RecommendationPanel team={team} />
              </div>
            </div>
          )}

          {team.length === 0 && (
            <div className="text-center py-20 opacity-20">
              <p className="italic">Your team is empty. Use the search bar above to join the battle.</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 text-center border-t border-white/5 opacity-30 text-[10px] uppercase tracking-widest">
          Powered by PokéAPI • Built with React & Tailwind CSS
        </footer>
      </div>

      <PokemonCardModal
        pokemon={expandedPokemon}
        chartType={chartType}
        onClose={closeExpandedPokemon}
      />
    </div>
  );
};

export default App;
