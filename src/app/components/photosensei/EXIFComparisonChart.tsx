import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface EXIFSetting {
  name: string;
  current: string;
  ideal: string;
  status: 'good' | 'warning' | 'risk';
  tooltip?: string;
}

interface EXIFComparisonChartProps {
  genre: string;
  settings: EXIFSetting[];
  className?: string;
}

export function EXIFComparisonChart({ genre, settings, className = '' }: EXIFComparisonChartProps) {
  const statusConfig = {
    good: { color: 'bg-accent', icon: CheckCircle, text: 'text-accent' },
    warning: { color: 'bg-warning', icon: AlertCircle, text: 'text-warning' },
    risk: { color: 'bg-destructive', icon: AlertCircle, text: 'text-destructive' }
  };

  return (
    <Card className={`p-4 space-y-4 border border-white/5 bg-muted/10 shadow-none rounded-none ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-foreground">Settings Analysis</h4>
        <Badge variant="secondary" className="text-[10px] font-mono uppercase tracking-widest rounded-none bg-foreground text-background">
          {genre}
        </Badge>
      </div>

      <div className="space-y-4">
        {settings.map((setting, index) => {
          const config = statusConfig[setting.status];
          const StatusIcon = config.icon;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-foreground">{setting.name}</span>
                    <StatusIcon className="h-3.5 w-3.5 text-foreground" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-none">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Current</div>
                  <div className="font-bold text-foreground font-mono">{setting.current}</div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-none">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Ideal for {genre}</div>
                  <div className="font-bold text-foreground font-mono">{setting.ideal}</div>
                </div>
              </div>

              {setting.tooltip && (
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-none text-xs leading-relaxed text-muted-foreground flex items-start space-x-2">
                  <span className="flex-shrink-0 text-foreground">💡</span>
                  <span>{setting.tooltip}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}