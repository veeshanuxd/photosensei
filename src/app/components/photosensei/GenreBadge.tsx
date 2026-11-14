import React from 'react';
import { Badge } from '../ui/badge';
import { User, MapPin, Mountain, Building, Utensils, Bird, Users } from 'lucide-react';

interface GenreBadgeProps {
  genre: string;
  size?: 'sm' | 'md' | 'lg';
  showModule?: boolean;
  className?: string;
}

export function GenreBadge({ 
  genre, 
  size = 'md',
  showModule = false,
  className = '' 
}: GenreBadgeProps) {
  const genreConfig: Record<string, { icon: React.ReactNode, color: string }> = {
    Portrait: { icon: <User className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Street: { icon: <MapPin className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Landscape: { icon: <Mountain className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Architecture: { icon: <Building className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Food: { icon: <Utensils className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Wildlife: { icon: <Bird className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    People: { icon: <Users className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' },
    Nature: { icon: <Mountain className="h-3.5 w-3.5 mr-1" />, color: 'bg-muted/10 text-foreground border-white/5 rounded-none' }
  };

  const config = genreConfig[genre];
  
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 uppercase tracking-wider',
    md: 'text-xs px-3 py-1 uppercase tracking-wider',
    lg: 'text-sm px-4 py-1.5 uppercase tracking-wider'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${config.color} ${sizeClasses[size]} border font-medium ${className}`}
    >
      {config.icon}
      {genre}
      {showModule && (
        <span className="ml-1.5 opacity-70">Module</span>
      )}
    </Badge>
  );
}