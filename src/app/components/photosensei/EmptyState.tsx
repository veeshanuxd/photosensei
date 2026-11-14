import React from 'react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`text-center space-y-4 py-10 ${className}`}>
      <div className="w-16 h-16 bg-muted/50 rounded-2xl mx-auto flex items-center justify-center">
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="space-y-1.5 px-6">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      
      {actionLabel && onAction && (
        <Button 
          className="bg-gradient-to-r from-[#2962FF] to-[#00C853] shadow-md rounded-xl"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
