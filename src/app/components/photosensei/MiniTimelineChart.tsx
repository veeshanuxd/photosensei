import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface DataPoint {
  date: string;
  score: number;
}

interface MiniTimelineChartProps {
  data: DataPoint[];
  pillar?: 'overall' | 'framing' | 'composition' | 'lighting' | 'exposure';
  className?: string;
}

export function MiniTimelineChart({ 
  data, 
  pillar = 'overall',
  className = '' 
}: MiniTimelineChartProps) {
  const colorMap: Record<string, string> = {
    'overall': '#2962FF',
    'framing': '#2962FF',
    'composition': '#00C853',
    'lighting': '#FF6D00',
    'exposure': '#7C4DFF'
  };

  const color = colorMap[pillar];
  
  // Calculate trend
  const firstScore = data[0]?.score || 0;
  const lastScore = data[data.length - 1]?.score || 0;
  const trend = lastScore - firstScore;
  const trendPercent = firstScore > 0 ? ((trend / firstScore) * 100).toFixed(0) : '0';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-foreground">{Math.round(lastScore)}</span>
          <span className={`text-xs font-medium ${trend >= 0 ? 'text-accent' : 'text-warning'}`}>
            {trend >= 0 ? '+' : ''}{trendPercent}%
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Last 30 days</span>
      </div>
      
      <div className="w-full h-12 text-foreground/45">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis domain={[0, 100]} hide />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="currentColor"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}