import React from 'react';
import { Card } from '../ui/card';

interface FocalLengthData {
  range: string;
  count: number;
  percentage: number;
}

interface FocalLengthHeatmapProps {
  data: FocalLengthData[];
  className?: string;
}

export function FocalLengthHeatmap({ data, className = '' }: FocalLengthHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count));

  const getIntensity = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'bg-primary text-primary-foreground';
    if (ratio > 0.4) return 'bg-primary/60 text-primary-foreground';
    if (ratio > 0.2) return 'bg-primary/30 text-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <div className="space-y-2">
        <h4 className="font-medium">Lens Usage Analytics</h4>
        <p className="text-sm text-muted-foreground">
          Your most commonly used focal lengths
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg transition-all hover:scale-105 cursor-pointer ${getIntensity(item.count)}`}
          >
            <div className="font-semibold text-sm">{item.range}</div>
            <div className="text-xs mt-1">{item.count} photos</div>
            <div className="text-xs opacity-75">{item.percentage}%</div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-muted rounded" />
            <span>Rarely used</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded" />
            <span>Most used</span>
          </div>
        </div>
      </div>
    </Card>
  );
}