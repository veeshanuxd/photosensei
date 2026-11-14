import React from 'react';
import { Card } from '../ui/card';
import { Award } from 'lucide-react';

interface BadgeCardProps {
  title: string;
  description: string;
  pillar: 'Framing' | 'Composition' | 'Lighting' | 'Exposure' | 'Master';
  progress: number;
  total: number;
  earned?: boolean;
  earnedDate?: string;
  className?: string;
}

export function BadgeCard({ 
  title, 
  description, 
  pillar,
  progress,
  total,
  earned = false,
  earnedDate,
  className = '' 
}: BadgeCardProps) {
  const pillarConfig = {
    Framing: { gradient: 'from-[#2962FF] to-[#5E8AFF]', icon: '🖼️', color: '#2962FF' },
    Composition: { gradient: 'from-[#00C853] to-[#4CAF50]', icon: '🎯', color: '#00C853' },
    Lighting: { gradient: 'from-[#FF6D00] to-[#FF9800]', icon: '💡', color: '#FF6D00' },
    Exposure: { gradient: 'from-[#7C4DFF] to-[#B388FF]', icon: '📸', color: '#7C4DFF' },
    Master: { gradient: 'from-[#FFD700] to-[#FFA000]', icon: '👑', color: '#FFD700' }
  };

  const config = pillarConfig[pillar];
  const progressPercent = (progress / total) * 100;

  return (
    <Card className={`p-4 space-y-3 border-none rounded-xl ${
      earned ? 'bg-gradient-to-br from-accent/8 to-transparent ring-1 ring-accent/20' : 'bg-muted/30 opacity-80'
    } ${className}`}>
      <div className="flex flex-col items-center space-y-2.5">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm ${!earned && 'grayscale opacity-60'}`}>
          {earned ? (
            <span className="text-2xl">{config.icon}</span>
          ) : (
            <Award className="h-7 w-7 text-white/80" />
          )}
        </div>
        
        <div className="text-center space-y-0.5">
          <h4 className="text-xs font-semibold">{title}</h4>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        {earned ? (
          <div className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
            Earned {earnedDate}
          </div>
        ) : (
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{progress}/{total}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500 rounded-full`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
