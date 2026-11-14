import React, { useEffect, useState } from 'react';
import { Card } from '../ui/card';
import { Frame, Target, Sun, Aperture, BarChart2 } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  title: string;
  maxScore?: number;
  className?: string;
}

export function ScoreCard({ score, title, maxScore = 100, className = '' }: ScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const percentage = (displayScore / maxScore) * 100;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 800;
      const steps = 40;
      const increment = score / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, 200);
    return () => clearTimeout(timer);
  }, [score]);

  const getConfig = (title: string) => {
    const iconClass = "h-4.5 w-4.5 text-foreground";
    switch (title.toLowerCase()) {
      case 'framing':
        return { icon: <Frame className={iconClass} /> };
      case 'composition':
        return { icon: <Target className={iconClass} /> };
      case 'lighting':
        return { icon: <Sun className={iconClass} /> };
      case 'exposure':
        return { icon: <Aperture className={iconClass} /> };
      default:
        return { icon: <BarChart2 className={iconClass} /> };
    }
  };
  
  const config = getConfig(title);

  return (
    <Card className={`p-4 space-y-3 bg-muted/10 border border-white/5 shadow-none hover:border-white/20 transition-all duration-300 active:scale-[0.98] ${className}`}>
      <div className="flex items-center justify-between">
        <span>{config.icon}</span>
        <div className="tabular-nums font-mono text-foreground" style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>
          {displayScore}
        </div>
      </div>
      <div>
        <h4 className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{title}</h4>
        <div className="w-full h-[2px] bg-white/10 overflow-hidden mt-2">
          <div 
            className="h-full bg-foreground transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
