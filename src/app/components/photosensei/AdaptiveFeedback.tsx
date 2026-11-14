import React from 'react';
import { Card } from '../ui/card';
import { Sparkles, Target, ArrowUpRight, Frame, Sun, Aperture } from 'lucide-react';

interface AdaptiveFeedbackProps {
  weakestArea: 'Framing' | 'Composition' | 'Lighting' | 'Exposure';
  currentScore: number;
  targetScore: number;
  personalizedTip: string;
  className?: string;
}

export function AdaptiveFeedback({ 
  weakestArea, 
  currentScore, 
  targetScore,
  personalizedTip,
  className = '' 
}: AdaptiveFeedbackProps) {
  const pillarConfig: Record<string, { icon: React.ReactNode }> = {
    'Framing': { icon: <Frame className="h-4.5 w-4.5 text-foreground" /> },
    'Composition': { icon: <Target className="h-4.5 w-4.5 text-foreground" /> },
    'Lighting': { icon: <Sun className="h-4.5 w-4.5 text-foreground" /> },
    'Exposure': { icon: <Aperture className="h-4.5 w-4.5 text-foreground" /> }
  };

  const config = pillarConfig[weakestArea];
  const progressPercent = Math.min((currentScore / targetScore) * 100, 100);
  const gap = targetScore - currentScore;

  return (
    <Card className={`overflow-hidden border border-white/5 bg-muted/10 shadow-none ${className}`}>
      {/* Header border */}
      <div className="h-px bg-white/5" />
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-foreground" />
            <h4 className="text-xs font-bold uppercase tracking-widest text-foreground">AI Insight</h4>
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground font-mono">
            <ArrowUpRight className="h-3 w-3" />
            <span>{gap} pts to goal</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-white/[0.02] border border-white/5 rounded-none">
          <div className="flex-shrink-0">{config.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-1.5">Focus: {weakestArea}</p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 h-[2px] bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-foreground transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono tabular-nums">{currentScore}/{targetScore}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 p-3 bg-white/[0.02] border border-white/5 rounded-none">
          <Target className="h-3.5 w-3.5 text-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed text-muted-foreground">{personalizedTip}</p>
        </div>
      </div>
    </Card>
  );
}
