import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Camera, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LiveSessionCardProps {
  imageUrl: string;
  timestamp: string;
  exposureHint?: string;
  tilt?: number;
  onAnalyze?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function LiveSessionCard({ 
  imageUrl, 
  timestamp, 
  exposureHint,
  tilt,
  onAnalyze, 
  onDelete,
  className = '' 
}: LiveSessionCardProps) {
  return (
    <Card className={`overflow-hidden border border-white/5 bg-muted/10 shadow-none rounded-none ${className}`}>
      <div className="relative">
        <div className="w-full h-40">
          <ImageWithFallback
            src={imageUrl}
            alt="Live session capture"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Metadata Overlay */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {exposureHint && (
            <span className="text-[10px] bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-none font-mono uppercase tracking-wider border border-white/10">
              {exposureHint}
            </span>
          )}
          {tilt !== undefined && Math.abs(tilt) > 1 && (
            <span className="text-[10px] bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-none font-mono uppercase tracking-wider border border-white/10">
              Tilted {tilt > 0 ? '+' : ''}{Math.round(tilt)}°
            </span>
          )}
        </div>
        
        <div className="absolute top-2 right-2">
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 bg-black/70 backdrop-blur-sm text-white hover:bg-black border border-white/10 rounded-none"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Live Capture</p>
            <p className="text-[10px] text-muted-foreground font-mono">{timestamp}</p>
          </div>
        </div>
        
        <Button 
          variant="leica"
          size="sm" 
          className="w-full text-xs uppercase tracking-wider font-semibold"
          onClick={onAnalyze}
        >
          <Camera className="h-4 w-4 mr-2" />
          Analyze Photo
        </Button>
      </div>
    </Card>
  );
}