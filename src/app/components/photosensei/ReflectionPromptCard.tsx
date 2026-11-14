import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ReflectionPromptCardProps {
  originalPhoto: {
    imageUrl: string;
    score: number;
    date: string;
    weaknesses: string[];
  };
  hasReshoot?: boolean;
  reshootScore?: number;
  improvement?: number;
  onUploadReshoot?: () => void;
  className?: string;
}

export function ReflectionPromptCard({ 
  originalPhoto,
  hasReshoot = false,
  reshootScore,
  improvement,
  onUploadReshoot,
  className = '' 
}: ReflectionPromptCardProps) {
  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <RefreshCw className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">Reflection Challenge</h4>
          <p className="text-sm text-muted-foreground">Track your improvement over time</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h5 className="text-sm font-medium">Your First Photo</h5>
          <Badge variant="secondary" className="text-xs">{originalPhoto.date}</Badge>
        </div>

        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-muted">
          <ImageWithFallback
            src={originalPhoto.imageUrl}
            alt="Original photo"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-sm font-medium">
            Score: {originalPhoto.score}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Areas to improve:</p>
          <div className="flex flex-wrap gap-2">
            {originalPhoto.weaknesses.map((weakness, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {weakness}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {hasReshoot && reshootScore && improvement !== undefined ? (
        <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-accent" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-accent">+{improvement} points</div>
              <p className="text-sm text-muted-foreground">
                New score: {reshootScore}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Button 
          className="w-full bg-gradient-to-r from-primary to-accent"
          onClick={onUploadReshoot}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Upload a Reshoot
        </Button>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed">
        Apply what you've learned from {originalPhoto.weaknesses.join(', ')} lessons and see how much you've improved!
      </p>
    </Card>
  );
}