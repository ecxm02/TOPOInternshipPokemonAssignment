import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

const StatRadarChart = ({ stats, color }) => {
  // Map PokeAPI stats to Recharts format
  // PokeAPI stats are: hp, attack, defense, special-attack, special-defense, speed
  const data = stats.map(s => {
    let name = '';
    switch (s.stat.name) {
      case 'hp': name = 'HP'; break;
      case 'attack': name = 'ATK'; break;
      case 'defense': name = 'DEF'; break;
      case 'special-attack': name = 'SpA'; break;
      case 'special-defense': name = 'SpD'; break;
      case 'speed': name = 'SPD'; break;
      default: name = s.stat.name;
    }
    return {
      subject: name,
      value: s.base_stat,
      fullMark: 255, // Max possible base stat
    };
  });

  return (
    <div className="w-full h-48 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#e2e8f0', fontSize: 10 }}
          />
          <Radar
            name="Stats"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatRadarChart;
