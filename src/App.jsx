import React, { useState } from 'react';
import { useTeam } from './hooks/useTeam';
import SearchBar from './components/Misc/SearchBar';
import TeamGrid from './components/Team/TeamGrid';
import TypeCoverageChart from './components/TypeAnalysis/TypeCoverageChart';
import TeamTypeOverall from './components/TypeAnalysis/TeamTypeOverall';
import TeamStatChart from './components/Team/TeamStatChart';
import TeamRoleColumns from './components/Team/TeamRoleColumns';
import RecommendationPanel from './components/Recommendation/RecommendationPanel';
import StaticBackground from './components/Misc/AnimatedBackground';
import PokemonCardModal from './components/Team/PokemonCardModal';

const App = () => {
  // --- Team and page view state
  const { team, addPokemon, removePokemon } = useTeam();
  const [activePage, setActivePage] = useState('team');
  const [typeAnalysisView, setTypeAnalysisView] = useState('overall');
  const [expandedPokemon, setExpandedPokemon] = useState(null);
  const [searchFocusSignal, setSearchFocusSignal] = useState(0);

  // --- UI action handlers
  const openExpandedPokemon = (pokemon) => setExpandedPokemon(pokemon);
  const closeExpandedPokemon = () => setExpandedPokemon(null);
  const focusSearchBar = () => {
    setActivePage('team');
    setSearchFocusSignal((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen text-slate-200 font-inter selection:bg-brand-500/30 relative">
      {/* --- Decorative background layer */}
      <StaticBackground />
      
      <div className="relative z-10">
        {/* --- App header */}
        <header className="py-12 px-4 text-center">
          <h1 className="logo text-3xl md:text-5xl mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600 drop-shadow-sm">
            POKÉMON TEAM BUILDER
          </h1>
        </header>

        <main className="container mx-auto pb-20">
          {/* --- Primary page navigation */}
          <section className="px-4 mb-8 relative flex items-center justify-center">
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 gap-1 w-fit">
              <button
                onClick={() => setActivePage('team')}
                className={`px-4 py-2 rounded-md text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${activePage === 'team' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
              >
                Team
              </button>
              <button
                onClick={() => setActivePage('type-analysis')}
                className={`px-4 py-2 rounded-md text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${activePage === 'type-analysis' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
              >
                Type Analysis
              </button>
              <button
                onClick={() => setActivePage('stat-analysis')}
                className={`px-4 py-2 rounded-md text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${activePage === 'stat-analysis' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
              >
                Stat Analysis
              </button>
              <button
                onClick={() => setActivePage('recommendations')}
                className={`px-4 py-2 rounded-md text-[11px] font-bold tracking-widest uppercase transition-all cursor-pointer ${activePage === 'recommendations' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
              >
                Recommendations
              </button>
            </div>
            <span className="absolute right-4 text-[10px] font-mono text-white/20">{team.length} / 6</span>
          </section>

          {activePage === 'team' && (
            <>
              {/* --- Team search panel */}
              <section className="mb-8">
                <SearchBar onAdd={addPokemon} teamSize={team.length} focusSignal={searchFocusSignal} />
              </section>

              {/* --- Team slots grid */}
              <section className="mb-16">
                <div className="px-4 mb-4">
                </div>
                <TeamGrid
                  team={team}
                  onRemove={removePokemon}
                  onExpand={openExpandedPokemon}
                  onRequestAdd={focusSearchBar}
                />
              </section>
            </>
          )}

          {activePage === 'type-analysis' && (
            <>
              {/* --- Type analysis page */}
              {team.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
                  <div className="glass-card p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6 text-left border-l-4 border-brand-500 pl-4 uppercase tracking-tighter">
                      Type Analysis
                    </h2>

                    <div className="mb-6 flex justify-center">
                      <div className="flex bg-white/5 p-1 rounded-lg border border-white/10 gap-1 w-fit">
                        <button
                          onClick={() => setTypeAnalysisView('overall')}
                          className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${typeAnalysisView === 'overall' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                        >
                          Overall
                        </button>
                        <button
                          onClick={() => setTypeAnalysisView('breakdown')}
                          className={`px-4 py-2 rounded-md text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer ${typeAnalysisView === 'breakdown' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                        >
                          Breakdown
                        </button>
                      </div>
                    </div>

                    {typeAnalysisView === 'overall' ? (
                      <TeamTypeOverall team={team} />
                    ) : (
                      <TypeCoverageChart team={team} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-20 px-4">
                  <p className="italic">Build your team first, then open Type Analysis to review matchup coverage.</p>
                </div>
              )}
            </>
          )}

          {activePage === 'stat-analysis' && (
            <>
              {/* --- Stat analysis page */}
              {team.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 text-left border-l-4 border-brand-500 pl-4 uppercase tracking-tighter">
                      Stat Analysis
                    </h2>
                    <TeamStatChart team={team} />
                    <TeamRoleColumns team={team} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-20 px-4">
                  <p className="italic">Build your team first, then open Stat Analysis to review recommendations.</p>
                </div>
              )}
            </>
          )}

          {activePage === 'recommendations' && (
            <>
              {/* --- Recommendation page */}
              {team.length > 0 ? (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 px-4">
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-6 text-left border-l-4 border-brand-500 pl-4 uppercase tracking-tighter">
                      Recommendations
                    </h2>
                    <RecommendationPanel team={team} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 opacity-20 px-4">
                  <p className="italic">Build your team first, then open Recommendations.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* --- Expanded Pokemon modal */}
      <PokemonCardModal
        pokemon={expandedPokemon}
        onClose={closeExpandedPokemon}
      />
    </div>
  );
};

export default App;
