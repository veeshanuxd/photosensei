import React from 'react';
import { Card } from '../ui/card';
import { TrendingUp, TrendingDown, Target, Frame, Sun, Aperture } from 'lucide-react';

interface ProgressInsightCardProps {
  pillar: 'Framing' | 'Composition' | 'Lighting' | 'Exposure';
  improvement: number;
  timeframe: string;
  currentScore: number;
  recommendation?: string;
  className?: string;
}

export function ProgressInsightCard({ 
  pillar, 
  improvement, 
  timeframe, 
  currentScore,
  recommendation,
  className = '' 
}: ProgressInsightCardProps) {
  const isPositive = improvement > 0;
  const isNeutral = improvement === 0;

  const pillarIcons: Record<string, React.ReactNode> = {
    'Framing': <Frame className="h-4.5 w-4.5 text-foreground" />,
    'Composition': <Target className="h-4.5 w-4.5 text-foreground" />,
    'Lighting': <Sun className="h-4.5 w-4.5 text-foreground" />,
    'Exposure': <Aperture className="h-4.5 w-4.5 text-foreground" />
  };

  return (
    <Card className={`p-4 space-y-3 bg-muted/10 border border-white/5 shadow-none rounded-none ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div>{pillarIcons[pillar]}</div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">{pillar}</h4>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{timeframe}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-xs font-mono font-bold text-foreground">
          {!isNeutral && (isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          ))}
          <span>
            {isPositive ? '+' : ''}{improvement}%
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-muted-foreground">Current Average</span>
          <span className="font-bold text-foreground">{currentScore}</span>
        </div>
        
        {recommendation && (
          <div className="flex items-start space-x-2 pt-2 border-t border-white/5">
            <Target className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">{recommendation}</p>
          </div>
        )}
      </div>
    </Card>
  );
}