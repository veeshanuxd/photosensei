import React from 'react';
import { Card } from '../ui/card';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { MiniTimelineChart } from './MiniTimelineChart';

interface UserProfileProps {
  name: string;
  overallScore: number;
  timelineData: Array<{ date: string; score: number }>;
  onViewProgress?: () => void;
  className?: string;
}

export function UserProfile({ 
  name, 
  overallScore, 
  timelineData,
  onViewProgress,
  className = '' 
}: UserProfileProps) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const level = overallScore >= 90 ? 'Master' : overallScore >= 80 ? 'Advanced' : overallScore >= 70 ? 'Intermediate' : 'Beginner';
  const levelProgress = (overallScore % 10) * 10;

  return (
    <Card 
      className={`p-4 bg-muted/10 border border-white/5 shadow-none cursor-pointer active:scale-[0.99] transition-transform ${className}`}
      onClick={onViewProgress}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-foreground text-background rounded-none flex items-center justify-center">
              <span className="text-sm font-semibold uppercase">{initials}</span>
            </div>
            {/* Level ring */}
            <svg className="absolute -inset-0.5 w-[52px] h-[52px]" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted/10" />
              <circle 
                cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1" 
                strokeDasharray={`${2 * Math.PI * 24}`} 
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - levelProgress / 100)}`}
                strokeLinecap="square" 
                className="transform -rotate-90 origin-center text-foreground"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground">{name}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-foreground font-medium font-mono uppercase tracking-widest">{level}</span>
              <span className="text-xs text-muted-foreground font-mono">Score: {overallScore}</span>
            </div>
          </div>
        </div>
        
        {onViewProgress && (
          <div className="flex items-center space-x-1 text-foreground/75 hover:text-foreground">
            <TrendingUp className="h-4 w-4" />
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
      
      <div className="pt-3 border-t border-white/5">
        <MiniTimelineChart data={timelineData} pillar="overall" />
      </div>
    </Card>
  );
}
