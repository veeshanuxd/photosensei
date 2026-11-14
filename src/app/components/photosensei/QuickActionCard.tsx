import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  gradient: string;
  iconColor: string;
  onClick?: () => void;
  className?: string;
}

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  subtitle, 
  gradient, 
  iconColor,
  onClick,
  className = '' 
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] bg-gradient-to-br ${gradient} border border-transparent hover:border-border/50 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
