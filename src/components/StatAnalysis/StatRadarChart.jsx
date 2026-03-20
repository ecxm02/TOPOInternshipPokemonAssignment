import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const StatRadarChart = ({ stats, color }) => {
  // --- Map PokeAPI stats into radar-friendly display labels
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
    };
  });

  return (
    // --- Recharts radar visualization
    <div className="w-full h-72 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#e2e8f0', fontSize: 16 }}
          />
          <PolarRadiusAxis domain={[0, 255]} tick={false} axisLine={false} />
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
