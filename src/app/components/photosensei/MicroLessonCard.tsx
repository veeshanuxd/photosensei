import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Lock, CheckCircle, Clock, Frame, Target, Sun, Aperture } from 'lucide-react';

interface MicroLessonCardProps {
  title: string;
  description: string;
  pillar: 'Framing' | 'Composition' | 'Lighting' | 'Exposure';
  duration: string;
  status: 'locked' | 'available' | 'completed';
  unlockedBy?: string;
  onStart?: () => void;
  className?: string;
}

export function MicroLessonCard({ 
  title, 
  description, 
  pillar,
  duration,
  status,
  unlockedBy,
  onStart,
  className = '' 
}: MicroLessonCardProps) {
  const pillarIcons: Record<string, React.ReactNode> = {
    Framing: <Frame className="h-5 w-5 text-foreground" />,
    Composition: <Target className="h-5 w-5 text-foreground" />,
    Lighting: <Sun className="h-5 w-5 text-foreground" />,
    Exposure: <Aperture className="h-5 w-5 text-foreground" />
  };

  return (
    <Card className={`p-4 space-y-4 border border-white/5 bg-muted/10 shadow-none rounded-none ${status === 'locked' ? 'opacity-40' : ''} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3.5 flex-1">
          <div className="flex-shrink-0 mt-0.5">{pillarIcons[pillar]}</div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm leading-tight text-foreground">{title}</h4>
              {status === 'completed' && (
                <CheckCircle className="h-3.5 w-3.5 text-foreground flex-shrink-0" />
              )}
              {status === 'locked' && (
                <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
            
            {unlockedBy && status !== 'completed' && (
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Unlocked by: {unlockedBy}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-widest rounded-none border-white/10 bg-white/[0.03] text-foreground">
            {pillar}
          </Badge>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground font-mono">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </div>
        </div>
        
        {status === 'available' && (
          <Button variant="leica" size="sm" className="h-8 text-xs uppercase tracking-wider font-semibold" onClick={onStart}>
            Start
          </Button>
        )}
        {status === 'completed' && (
          <Button variant="leica" size="sm" className="h-8 text-xs uppercase tracking-wider font-semibold" onClick={onStart}>
            Review
          </Button>
        )}
      </div>
    </Card>
  );
}