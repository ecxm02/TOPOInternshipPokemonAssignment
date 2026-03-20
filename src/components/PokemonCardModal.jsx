import React, { useEffect } from 'react';
import TypeBadge from './TypeBadge';
import StatRadarChart from './StatRadarChart';
import { typeColors } from '../utils/typeColors';
import { getPokemonEffectiveness } from '../utils/typeAnalysis';
import { classifyRole } from '../utils/roleClassifier';

const MiniBadge = ({ type, multiplier }) => {
  const color = typeColors[type] || '#3b82f6';

  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wide text-white shadow-sm"
      style={{ backgroundColor: `${color}cc` }}
    >
      <span>{type.substring(0, 3)}</span>
      {multiplier ? <span className="text-[9px] text-white/90">{multiplier}x</span> : null}
    </div>
  );
};

const PokemonCardModal = ({ pokemon, onClose }) => {
  useEffect(() => {
    if (!pokemon) return undefined;

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [pokemon, onClose]);

  if (!pokemon) return null;

  const typeNames = pokemon.types.map((t) => t.type.name);
  const primaryType = pokemon.types[0].type.name;
  const themeColor = typeColors[primaryType] || '#3b82f6';
  const animatedSprite = pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokemon.sprites.front_default;
  const officialPhoto = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default;
  const { advantages, disadvantages, weaknesses, resistances } = getPokemonEffectiveness(typeNames);
  const total = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);
  const roleLabel = classifyRole(pokemon.stats);
  const roleTone = roleLabel.includes('Sweeper')
    ? { bg: '#ef444433', border: '#ef444488', text: '#fecaca' }
    : roleLabel.includes('Tank')
      ? { bg: '#3b82f633', border: '#3b82f688', text: '#bfdbfe' }
      : roleLabel.includes('Mixed')
        ? { bg: '#f59e0b33', border: '#f59e0b88', text: '#fde68a' }
        : { bg: '#10b98133', border: '#10b98188', text: '#a7f3d0' };

  const statRows = [
    { name: 'HP', val: pokemon.stats[0].base_stat },
    { name: 'DEF', val: pokemon.stats[2].base_stat },
    { name: 'SpD', val: pokemon.stats[4].base_stat },
    { name: 'SPE', val: pokemon.stats[5].base_stat },
    { name: 'ATK', val: pokemon.stats[1].base_stat },
    { name: 'SpA', val: pokemon.stats[3].base_stat }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${pokemon.name} details`}
    >
      <div className="relative w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
        <div className="glass-card p-5 md:p-6 relative overflow-hidden flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="capitalize text-xl md:text-2xl font-black tracking-tight truncate">{pokemon.name}</h3>
              <span
                className="px-2 py-1 rounded-md text-[10px] md:text-[11px] font-black uppercase tracking-wide whitespace-nowrap"
                style={{
                  backgroundColor: roleTone.bg,
                  border: `1px solid ${roleTone.border}`,
                  color: roleTone.text
                }}
              >
                {roleLabel}
              </span>
              <img src={animatedSprite} alt="sprite" className="w-8 h-8 object-contain pixelated shrink-0" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                {pokemon.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-md bg-white/20 text-white/40 hover:bg-red-500/20 hover:text-red-500 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4 items-start">
            <div className="flex justify-center relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-35 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
              <img src={officialPhoto} alt={pokemon.name} className="max-h-52 max-w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)] relative z-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Deals Extra Damage To</span>
                <div className="flex flex-wrap gap-2">
                  {advantages.length > 0 ? advantages.map((type) => (
                    <MiniBadge key={type} type={type} multiplier={2} />
                  )) : <span className="text-[10px] text-white/40 italic">None</span>}
                </div>
              </div>

              <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Deals Less Damage To</span>
                <div className="flex flex-wrap gap-2">
                  {disadvantages.length > 0 ? disadvantages.map((type) => (
                    <MiniBadge key={type} type={type} multiplier={0.5} />
                  )) : <span className="text-[10px] text-white/40 italic">None</span>}
                </div>
              </div>

              <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Takes Extra Damage From</span>
                <div className="flex flex-wrap gap-2">
                  {weaknesses.length > 0 ? weaknesses.map(([type, mult]) => (
                    <MiniBadge key={type} type={type} multiplier={mult} />
                  )) : <span className="text-[10px] text-white/40 italic">None</span>}
                </div>
              </div>

              <div className="rounded-xl bg-black/35 border border-white/10 p-3 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Takes Less Damage From</span>
                <div className="flex flex-wrap gap-2">
                  {resistances.length > 0 ? resistances.map(([type, mult]) => (
                    <MiniBadge key={type} type={type} multiplier={mult} />
                  )) : <span className="text-[10px] text-white/40 italic">None</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 rounded-xl bg-black/35 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 blur-[55px] pointer-events-none -mr-20 -mt-20" style={{ backgroundColor: `${themeColor}33` }}></div>

            <div className="flex flex-col gap-3 relative z-10">
              {statRows.map((row) => (
                <div key={row.name} className="flex items-center gap-2">
                  <span className="w-8 text-[18px] font-black text-white/92 uppercase tracking-tighter shrink-0">{row.name}</span>
                  <div className="flex-1 h-2.5 bg-white/8 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((row.val / 255) * 100, 100)}%`, backgroundColor: themeColor }} />
                  </div>
                  <span className="w-8 text-[20px] font-mono font-black text-white/92 text-right shrink-0">{row.val}</span>
                </div>
              ))}

              <div className="h-px bg-white/10 my-1"></div>

              <div className="flex items-center gap-4">
                <span className="text-[15px] font-black uppercase tracking-[0.35em] text-white/92 shrink-0">TOTAL</span>
                <div className="flex-1 h-4 bg-white/8 rounded-full overflow-hidden p-px border border-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min((total / 1530) * 100, 100)}%`,
                      backgroundColor: themeColor,
                      boxShadow: `0 0 15px ${themeColor}80`
                    }}
                  />
                </div>
                <span className="text-[20px] font-mono font-black text-white/92 shrink-0">{total}</span>
              </div>
            </div>

            <div className="relative z-10 p-1">
              <StatRadarChart stats={pokemon.stats} color={themeColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCardModal;


