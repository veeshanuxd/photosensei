import React from 'react';
import { Card } from '../ui/card';
import { Check, Circle } from 'lucide-react';

interface DrillCardProps {
  title: string;
  description: string;
  completed?: boolean;
  className?: string;
  onClick?: () => void;
}

export function DrillCard({ title, description, completed = false, className = '', onClick }: DrillCardProps) {
  return (
    <Card 
      className={`p-3.5 cursor-pointer active:scale-[0.99] transition-all border-none rounded-xl ${
        completed ? 'bg-accent/8' : 'bg-muted/30'
      } ${className}`} 
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-0.5 flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>{title}</h4>
          <p className="text-[11px] text-muted-foreground truncate">{description}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          {completed ? (
            <div className="w-7 h-7 bg-gradient-to-br from-[#00C853] to-[#4CAF50] rounded-full flex items-center justify-center shadow-sm">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/20" />
          )}
        </div>
      </div>
    </Card>
  );
}
