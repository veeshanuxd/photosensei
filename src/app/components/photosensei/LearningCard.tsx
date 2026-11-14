import React from 'react';
import { Card } from '../ui/card';
import { Clock, Play } from 'lucide-react';

interface LearningCardProps {
  title: string;
  description: string;
  duration?: string;
  image?: string;
  className?: string;
}

export function LearningCard({ title, description, duration, image, className = '' }: LearningCardProps) {
  const colors = [
    'from-[#2962FF]/15 to-[#2962FF]/5',
    'from-[#00C853]/15 to-[#00C853]/5',
    'from-[#FF6D00]/15 to-[#FF6D00]/5',
    'from-[#7C4DFF]/15 to-[#7C4DFF]/5'
  ];
  const colorIndex = title.length % colors.length;

  return (
    <Card className={`flex-shrink-0 w-36 overflow-hidden border-none shadow-sm active:scale-[0.97] transition-transform ${className}`}>
      <div className={`h-20 bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center`}>
        <div className="w-10 h-10 bg-white/80 dark:bg-black/30 rounded-full flex items-center justify-center shadow-sm">
          <Play className="h-4 w-4 text-foreground ml-0.5" />
        </div>
      </div>
      <div className="p-3 space-y-1">
        <h4 className="text-xs font-semibold line-clamp-2 leading-tight">{title}</h4>
        <p className="text-[10px] text-muted-foreground line-clamp-1">{description}</p>
        {duration && (
          <div className="flex items-center space-x-1 text-[10px] text-muted-foreground">
            <Clock className="h-2.5 w-2.5" />
            <span>{duration}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
