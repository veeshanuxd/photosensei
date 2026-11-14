import React from 'react';
import { Card } from '../ui/card';
import { Flame, Trophy, ImageIcon } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalUploads: number;
  className?: string;
}

export function StreakTracker({ 
  currentStreak, 
  longestStreak, 
  totalUploads,
  className = '' 
}: StreakTrackerProps) {
  // Generate the last 7 days streak indicators
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const streakDays = days.map((_, i) => i < currentStreak % 7 || currentStreak >= 7);

  return (
    <Card className={`p-4 bg-gradient-to-br from-[#FF6D00]/10 via-[#FF6D00]/5 to-transparent border-none shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6D00] to-[#FF9800] rounded-xl flex items-center justify-center shadow-sm">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-[#FF6D00] tabular-nums" style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{currentStreak}</span>
              <span className="text-xs text-muted-foreground">day streak</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly streak dots */}
      <div className="flex items-center justify-between mb-3 px-1">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center space-y-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              streakDays[i] 
                ? 'bg-gradient-to-br from-[#FF6D00] to-[#FF9800] shadow-sm' 
                : 'bg-muted/50'
            }`}>
              {streakDays[i] && <Flame className="h-3 w-3 text-white" />}
            </div>
            <span className="text-[10px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
        <div className="flex items-center space-x-2">
          <Trophy className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-semibold tabular-nums">{longestStreak} days</div>
            <div className="text-[10px] text-muted-foreground">Best streak</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <div className="text-sm font-semibold tabular-nums">{totalUploads} photos</div>
            <div className="text-[10px] text-muted-foreground">Total critiqued</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
