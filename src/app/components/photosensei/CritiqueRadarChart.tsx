import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CritiqueRadarChartProps {
  scores: {
    framing: number;
    composition: number;
    lighting: number;
    exposure: number;
  };
  overallScore: number;
  className?: string;
}

export function CritiqueRadarChart({ scores, overallScore, className = '' }: CritiqueRadarChartProps) {
  const radarData = [
    { subject: 'Framing', score: scores.framing },
    { subject: 'Composition', score: scores.composition },
    { subject: 'Lighting', score: scores.lighting },
    { subject: 'Exposure', score: scores.exposure },
  ];

  const getGrade = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Decent';
    return 'Needs Work';
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div className="relative w-64 h-56 flex items-center justify-center font-mono">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="62%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: 500, letterSpacing: '0.1em' }} 
            />
            <Radar
              name="Metrics"
              dataKey="score"
              stroke="currentColor"
              fill="currentColor"
              fillOpacity={0.08}
              strokeWidth={1.5}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
          <span className="text-3xl font-bold font-mono tracking-tighter text-foreground">{overallScore}</span>
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">Overall</span>
        </div>
      </div>
      <div 
        className="px-3 py-0.5 rounded-none border border-foreground text-[10px] font-mono uppercase tracking-widest bg-foreground text-background font-bold"
      >
        {getGrade(overallScore)}
      </div>
    </div>
  );
}
