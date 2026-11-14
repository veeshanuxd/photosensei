import React from 'react';
import { Card } from '../ui/card';

interface CritiqueCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  className?: string;
}

export function CritiqueCard({ title, content, icon, className = '' }: CritiqueCardProps) {
  return (
    <Card className={`p-4 space-y-2.5 border-none bg-muted/30 rounded-xl shadow-sm active:scale-[0.995] transition-transform ${className}`}>
      <div className="flex items-center space-x-2.5">
        <div className="p-1.5 rounded-lg bg-background/80 shadow-sm">
          {icon}
        </div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-9">{content}</p>
    </Card>
  );
}
