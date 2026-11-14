import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Lightbulb, TrendingUp } from 'lucide-react';

interface Recommendation {
  setting: string;
  current: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

interface EXIFRecommendationCardProps {
  recommendations: Recommendation[];
  onApplyTip?: (setting: string) => void;
  className?: string;
}

export function EXIFRecommendationCard({ 
  recommendations, 
  onApplyTip,
  className = '' 
}: EXIFRecommendationCardProps) {
  const impactConfig = {
    high: { color: 'bg-accent/10 text-accent border-accent/20', label: 'High Impact' },
    medium: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Medium Impact' },
    low: { color: 'bg-primary/10 text-primary border-primary/20', label: 'Low Impact' }
  };

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Lightbulb className="h-5 w-5 text-primary" />
        <h4 className="font-medium">Recommended Combos</h4>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-4 space-y-3 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm">{rec.setting}</span>
                  <Badge variant="outline" className={`text-xs ${impactConfig[rec.impact].color}`}>
                    {impactConfig[rec.impact].label}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">{rec.current}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary font-medium">{rec.suggested}</span>
                </div>
              </div>
              <TrendingUp className="h-4 w-4 text-accent flex-shrink-0 mt-1" />
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rec.reason}
            </p>

            {onApplyTip && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full border-primary/20 hover:bg-primary/5"
                onClick={() => onApplyTip(rec.setting)}
              >
                Remember for Next Time
              </Button>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
}