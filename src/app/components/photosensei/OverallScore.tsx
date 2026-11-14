import React, { useEffect, useState } from 'react';

interface OverallScoreProps {
  score: number;
  maxScore?: number;
  label?: string;
  className?: string;
}

export function OverallScore({ score, maxScore = 100, label = "Overall Score", className = '' }: OverallScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

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

  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-[#00C853]'; // Green
    if (percentage >= 60) return 'text-[#2962FF]'; // Blue
    if (percentage >= 40) return 'text-[#FF6D00]'; // Orange
    return 'text-[#D50000]'; // Red
  };

  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className={`text-7xl font-bold tabular-nums transition-colors duration-500 ${getScoreColor()}`}>
        {displayScore}/{maxScore}
      </div>
      <p className="text-muted-foreground font-medium text-lg">{label}</p>
    </div>
  );
}