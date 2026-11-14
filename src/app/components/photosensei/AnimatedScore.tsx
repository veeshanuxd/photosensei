import React, { useEffect, useState, useRef } from 'react';

interface AnimatedScoreProps {
  score: number;
  maxScore?: number;
  size?: number;
  className?: string;
}

export function AnimatedScore({ 
  score, 
  maxScore = 100, 
  size = 160,
  className = '' 
}: AnimatedScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const percentage = (displayScore / maxScore) * 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      const duration = 1200;
      const steps = 60;
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
    }, 300);
    return () => clearTimeout(timer);
  }, [score, isVisible]);

  const getGrade = () => {
    const pct = (score / maxScore) * 100;
    if (pct >= 90) return 'Exceptional';
    if (pct >= 80) return 'Excellent';
    if (pct >= 70) return 'Good';
    if (pct >= 60) return 'Decent';
    return 'Needs Work';
  };

  return (
    <div ref={ref} className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted opacity-10"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? strokeDashoffset : circumference}
            strokeLinecap="square"
            className="text-foreground transition-all duration-1000"
            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div 
            className="tabular-nums font-mono text-foreground font-bold"
            style={{ fontSize: size * 0.25, lineHeight: 1 }}
          >
            {displayScore}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mt-1">
            of {maxScore}
          </div>
        </div>
      </div>
      <div 
        className="mt-3 px-3 py-0.5 rounded-none border border-foreground text-[10px] font-mono uppercase tracking-widest bg-foreground text-background font-bold"
      >
        {getGrade()}
      </div>
    </div>
  );
}
