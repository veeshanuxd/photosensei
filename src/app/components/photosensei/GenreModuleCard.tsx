import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, MapPin, Mountain, Building, Utensils, Bird, Users } from 'lucide-react';

interface GenreMetric {
  label: string;
  score: number;
  advice?: string;
}

interface GenreModuleCardProps {
  genre: string;
  metrics: GenreMetric[];
  contextualAdvice: string;
  className?: string;
}

export function GenreModuleCard({ 
  genre, 
  metrics, 
  contextualAdvice,
  className = '' 
}: GenreModuleCardProps) {
  const genreConfig: Record<string, { icon: React.ReactNode, color: string }> = {
    Portrait: { icon: <User className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Street: { icon: <MapPin className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Landscape: { icon: <Mountain className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Architecture: { icon: <Building className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Food: { icon: <Utensils className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Wildlife: { icon: <Bird className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    People: { icon: <Users className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' },
    Nature: { icon: <Mountain className="h-5 w-5 text-foreground" />, color: 'bg-muted/10 border border-white/5 shadow-none rounded-none' }
  };

  const config = genreConfig[genre];

  return (
    <Card className={`p-4 space-y-4 ${config.color} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div>{config.icon}</div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">{genre} Analysis</h4>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Specialized metrics</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-[9px] font-mono uppercase tracking-widest rounded-none bg-foreground text-background">
          Module Active
        </Badge>
      </div>

      <div className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="font-bold text-foreground">
                {metric.score}
              </span>
            </div>
            <div className="w-full h-[2px] bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-foreground transition-all duration-500"
                style={{ 
                  width: `${metric.score}%`
                }}
              />
            </div>
            {metric.advice && (
              <p className="text-xs text-muted-foreground italic mt-1">{metric.advice}</p>
            )}
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/5">
        <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground block mb-1">Tip</span>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {contextualAdvice}
        </p>
      </div>
    </Card>
  );
}