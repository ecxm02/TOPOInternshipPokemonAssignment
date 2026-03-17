import React, { useState, useEffect } from 'react';
import { calculateTeamWeaknesses } from '../utils/typeMatrix';
import { classifyRole } from '../utils/roleClassifier';

const RecommendationPanel = ({ team }) => {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const generateTips = async () => {
      if (team.length === 0) {
        setTips(["Start adding Pokémon to see team recommendations!"]);
        return;
      }

      const newTips = [];
      const results = await calculateTeamWeaknesses(team);
      const roles = team.map(p => classifyRole(p.stats));
      const speeds = team.map(p => p.stats.find(s => s.stat.name === 'speed').base_stat);

      // 1. Shared Weaknesses
      Object.entries(results).forEach(([type, data]) => {
        if (data.count >= 3) {
          newTips.push(`CRITICAL: Your team has ${data.count} Pokémon weak to ${type.toUpperCase()}. Consider adding a ${type.toUpperCase()}-resistant Pokémon.`);
        } else if (data.count === 2) {
          newTips.push(`WARNING: Multiple Pokémon share a weakness to ${type.toUpperCase()}.`);
        }
      });

      // 2. Role Gaps
      const hasTank = roles.some(r => r.includes('Tank'));
      if (!hasTank && team.length >= 3) {
        newTips.push("Strategy: Your team lacks a defensive 'Tank'. Consider adding a Pokémon with high HP and Defense.");
      }

      // 3. Speed Check
      const hasFast = speeds.some(s => s > 100);
      if (!hasFast && team.length >= 3) {
        newTips.push("Speed: No very fast Pokémon detected (Speed > 100). You might get outspeeded in battles.");
      }

      // 4. Team Variety
      const uniqueRoles = new Set(roles);
      if (uniqueRoles.size === 1 && team.length >= 3) {
        newTips.push("Variety: Your team is very one-dimensional. Try mixing different roles (Sweepers, Tanks, Support).");
      }

      if (newTips.length === 0) {
        newTips.push("Your team looks balanced! Keep it up.");
      }

      setTips(newTips);
    };

    generateTips();
  }, [team]);

  return (
    <div className="glass-card p-6 w-full max-w-5xl mx-auto mb-12">
      <h2 className="text-xl font-bold mb-6 text-left border-l-4 border-brand-500 pl-4 uppercase tracking-tighter">
        Pro Tips & Recommendations
      </h2>
      
      <div className="space-y-4">
        {tips.map((tip, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-xl border-l-4 flex items-start gap-4 animate-in fade-in slide-in-from-left duration-300`}
            style={{ 
              backgroundColor: tip.includes('CRITICAL') ? '#ef444410' : tip.includes('WARNING') ? '#f9731610' : '#3b82f610',
              borderColor: tip.includes('CRITICAL') ? '#ef4444' : tip.includes('WARNING') ? '#f97316' : '#3b82f6'
            }}
          >
            <div className="mt-1">
              {tip.includes('CRITICAL') ? (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;
