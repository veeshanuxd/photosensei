import React from 'react';
import { Card } from '../ui/card';
import { Sparkles, Users } from 'lucide-react';

interface DualScoreMeterProps {
  aiScore: number;
  communityScore: number;
  communityCount?: number;
  className?: string;
}

export function DualScoreMeter({ 
  aiScore, 
  communityScore, 
  communityCount = 0,
  className = '' 
}: DualScoreMeterProps) {
  const scoreDiff = communityScore - aiScore;
  const agreement = Math.max(0, 100 - Math.abs(scoreDiff) * 2);

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Dual Score Analysis</h4>
        <span className="text-xs text-muted-foreground">
          {communityCount} {communityCount === 1 ? 'rating' : 'ratings'}
        </span>
      </div>

      <div className="space-y-3">
        {/* AI Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">AI Analysis</span>
            </div>
            <span className="font-semibold text-primary">{aiScore}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
              style={{ width: `${aiScore}%` }}
            />
          </div>
        </div>

        {/* Community Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Community</span>
            </div>
            <span className="font-semibold text-accent">{communityScore}</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-500"
              style={{ width: `${communityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Agreement Indicator */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Agreement</span>
          <span className={`font-medium ${
            agreement > 85 ? 'text-accent' : 
            agreement > 70 ? 'text-warning' : 
            'text-muted-foreground'
          }`}>
            {agreement}%
          </span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-2">
          <div 
            className={`h-full transition-all duration-500 ${
              agreement > 85 ? 'bg-accent' : 
              agreement > 70 ? 'bg-warning' : 
              'bg-muted-foreground'
            }`}
            style={{ width: `${agreement}%` }}
          />
        </div>
      </div>

      {scoreDiff !== 0 && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {scoreDiff > 0 
            ? `Community rated this ${Math.abs(scoreDiff)} points higher than AI` 
            : `AI rated this ${Math.abs(scoreDiff)} points higher than community`}
        </p>
      )}
    </Card>
  );
}