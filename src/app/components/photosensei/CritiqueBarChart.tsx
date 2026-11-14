import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface CritiqueBarChartProps {
  scores: {
    framing: number;
    composition: number;
    lighting: number;
    exposure: number;
  };
  overallScore: number;
  className?: string;
}

export function CritiqueBarChart({ scores, overallScore, className = '' }: CritiqueBarChartProps) {
  const barData = [
    { name: 'Framing', score: scores.framing },
    { name: 'Composition', score: scores.composition },
    { name: 'Lighting', score: scores.lighting },
    { name: 'Exposure', score: scores.exposure },
  ];

  const getGrade = (score: number) => {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Decent';
    return 'Needs Work';
  };

  return (
    <div className={`flex flex-col items-center space-y-4 w-full p-2 ${className}`}>
      {/* Overall Score Banner */}
      <div className="flex items-baseline space-x-2 font-mono">
        <span className="text-3xl font-bold tracking-tighter text-foreground">{overallScore}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">of 100</span>
        <span className="text-[10px] text-muted-foreground">•</span>
        <span className="text-[10px] uppercase tracking-widest text-foreground font-bold">{getGrade(overallScore)}</span>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="w-full h-36 font-mono pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 0, left: -10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={90} 
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500, letterSpacing: '0.05em', opacity: 0.6 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Bar 
              dataKey="score" 
              fill="currentColor" 
              radius={0} 
              barSize={4} 
              background={{ fill: 'rgba(255,255,255,0.06)' }} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
