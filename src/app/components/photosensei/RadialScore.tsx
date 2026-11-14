import React, { useEffect, useState } from 'react';

interface RadialScoreProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function RadialScore({ 
  score, 
  maxScore = 100, 
  size = 120, 
  strokeWidth = 8,
  className = '' 
}: RadialScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const percentage = (score / maxScore) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayScore(prev => {
          if (prev >= score) {
            clearInterval(interval);
            return score;
          }
          return prev + 1;
        });
      }, 20);
      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="square"
          className="text-foreground transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="text-4xl font-bold tabular-nums font-mono text-foreground"
        >
          {displayScore}%
        </div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">Overall</div>
      </div>
    </div>
  );
}