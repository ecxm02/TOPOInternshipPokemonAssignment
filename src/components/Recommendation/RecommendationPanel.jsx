import React, { useMemo } from 'react';
import { classifyRole } from '../../utils/roleClassifier';
import { getPokemonEffectiveness } from '../../utils/typeAnalysis';

const TYPE_ORDER = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const ROLE_BUCKETS = [
  { key: 'physical-sweeper', label: 'Physical Sweeper', accepts: (role) => role === 'Physical Sweeper' },
  { key: 'special-sweeper', label: 'Special Sweeper', accepts: (role) => role === 'Special Sweeper' },
  { key: 'tank', label: 'Tank', accepts: (role) => role === 'Physical Tank' || role === 'Special Tank' },
  { key: 'mixed-attacker', label: 'Mixed Attacker', accepts: (role) => role === 'Mixed Attacker' },
  { key: 'support', label: 'Support/Utility', accepts: (role) => role === 'Support/Utility' }
];

const formatPokemonName = (name) => name
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('-');

const RecommendationPanel = ({ team }) => {
  // --- Generate recommendation cards from role and type coverage gaps
  const recommendations = useMemo(() => {
    if (team.length === 0) {
      return [
        {
          severity: 'info',
          issue: 'Your team is empty.',
          fix: 'Add Pokemon to generate type and role gap recommendations.'
        }
      ];
    }

    const hasOpenSlots = team.length < 6;
    const coveredAdvantages = new Set();
    const coveredResistances = new Set();
    const pokemonProfiles = [];
    const roleCounts = ROLE_BUCKETS.reduce((acc, bucket) => {
      acc[bucket.key] = 0;
      return acc;
    }, {});

    team.forEach((pokemon) => {
      const types = pokemon.types.map((t) => t.type.name);
      const { advantages, resistances } = getPokemonEffectiveness(types);
      const role = classifyRole(pokemon.stats);
      const bucket = ROLE_BUCKETS.find((b) => b.accepts(role));
      const bst = pokemon.stats.reduce((acc, s) => acc + s.base_stat, 0);
      const speed = pokemon.stats.find((s) => s.stat.name === 'speed')?.base_stat || 0;

      pokemonProfiles.push({
        pokemon,
        role,
        bucketKey: bucket?.key || 'support',
        bst,
        speed
      });

      advantages.forEach((type) => coveredAdvantages.add(type));
      resistances.forEach(([type]) => coveredResistances.add(type));

      if (bucket) {
        roleCounts[bucket.key] += 1;
      }
    });

    const noResistanceAgainst = TYPE_ORDER.filter((type) => !coveredResistances.has(type));
    const noStrengthAgainst = TYPE_ORDER.filter((type) => !coveredAdvantages.has(type));
    const missingRoles = ROLE_BUCKETS.filter((bucket) => roleCounts[bucket.key] === 0).map((bucket) => bucket.label);
    const crowdedRoleBuckets = ROLE_BUCKETS
      .filter((bucket) => roleCounts[bucket.key] > 1)
      .sort((a, b) => roleCounts[b.key] - roleCounts[a.key])
      .map((bucket) => ({ key: bucket.key, label: bucket.label, count: roleCounts[bucket.key] }));

    const pickReplacementNames = (maxCount = 2) => {
      const primaryCrowded = crowdedRoleBuckets[0];
      const pool = primaryCrowded
        ? pokemonProfiles.filter((p) => p.bucketKey === primaryCrowded.key)
        : pokemonProfiles;

      return pool
        .slice()
        .sort((a, b) => a.bst - b.bst || a.speed - b.speed)
        .slice(0, maxCount)
        .map((p) => formatPokemonName(p.pokemon.name));
    };

    const replacementNames = pickReplacementNames(2);
    const replacementText = replacementNames.length > 0
      ? replacementNames.join(' or ')
      : 'a redundant team member';

    const recs = [];

    if (noResistanceAgainst.length > 0) {
      recs.push({
        severity: 'warning',
        issue: `No one in your team is resistant against: ${noResistanceAgainst.map((t) => t.toUpperCase()).join(', ')}.`,
        fix: hasOpenSlots
          ? `Add a Pokemon that takes less damage from one or more of these types.`
          : `Consider replacing ${replacementText} with a Pokemon that takes less damage from these types.`
      });
    }

    if (noStrengthAgainst.length > 0) {
      recs.push({
        severity: 'warning',
        issue: `No one in your team is strong against: ${noStrengthAgainst.map((t) => t.toUpperCase()).join(', ')}.`,
        fix: hasOpenSlots
          ? `Add a Pokemon that deals extra damage to one or more of these types.`
          : `Consider replacing ${replacementText} with a Pokemon that pressures these types offensively.`
      });
    }

    if (missingRoles.length > 0) {
      recs.push({
        severity: 'info',
        issue: `Your team is missing class roles: ${missingRoles.join(', ')}.`,
        fix: hasOpenSlots
          ? `Use open slots to add one of the missing roles for better balance.`
          : `Swap out ${replacementText} to create space for a missing role.`
      });
    }

    if (recs.length === 0) {
      recs.push({
        severity: 'success',
        issue: 'No major type or role gaps found.',
        fix: 'Keep this core and tune around speed control or matchup preferences.'
      });
    }

    return recs;
  }, [team]);

  return (
    // --- Render recommendation list with severity styling
    <div className="space-y-4">
      {recommendations.map((item, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl border-l-4 flex items-start gap-4 animate-in fade-in slide-in-from-left duration-300`}
          style={{
            backgroundColor: item.severity === 'warning' ? '#f9731610' : item.severity === 'success' ? '#10b98110' : '#3b82f610',
            borderColor: item.severity === 'warning' ? '#f97316' : item.severity === 'success' ? '#10b981' : '#3b82f6'
          }}
        >
          <div className="mt-1">
            {item.severity === 'success' ? (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-semibold leading-relaxed opacity-95">Issue: {item.issue}</p>
            <p className="text-sm leading-relaxed opacity-85">Fix: {item.fix}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendationPanel;
