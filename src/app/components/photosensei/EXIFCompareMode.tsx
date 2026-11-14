import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowRight, Camera } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface EXIFData {
  aperture: string;
  shutter: string;
  iso: string;
  focalLength: string;
}

interface PhotoComparison {
  id: string;
  imageUrl: string;
  score: number;
  exif: EXIFData;
  label: string;
}

interface EXIFCompareModeProps {
  photo1: PhotoComparison;
  photo2: PhotoComparison;
  className?: string;
}

export function EXIFCompareMode({ photo1, photo2, className = '' }: EXIFCompareModeProps) {
  const getDifference = (value1: string, value2: string) => {
    // Extract numeric values for comparison
    const num1 = parseFloat(value1.replace(/[^\d.]/g, ''));
    const num2 = parseFloat(value2.replace(/[^\d.]/g, ''));
    
    if (num1 === num2) return 'same';
    return num1 < num2 ? 'lower' : 'higher';
  };

  const settings = [
    { name: 'Aperture', value1: photo1.exif.aperture, value2: photo2.exif.aperture },
    { name: 'Shutter', value1: photo1.exif.shutter, value2: photo2.exif.shutter },
    { name: 'ISO', value1: photo1.exif.iso, value2: photo2.exif.iso },
    { name: 'Focal Length', value1: photo1.exif.focalLength, value2: photo2.exif.focalLength }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Photo Previews */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3 space-y-2">
          <div className="relative w-full h-24 rounded-lg overflow-hidden bg-muted">
            <ImageWithFallback
              src={photo1.imageUrl}
              alt={photo1.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">{photo1.label}</div>
            <Badge variant="secondary" className="text-xs">
              Score: {photo1.score}
            </Badge>
          </div>
        </Card>

        <Card className="p-3 space-y-2">
          <div className="relative w-full h-24 rounded-lg overflow-hidden bg-muted">
            <ImageWithFallback
              src={photo2.imageUrl}
              alt={photo2.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium">{photo2.label}</div>
            <Badge variant="secondary" className="text-xs">
              Score: {photo2.score}
            </Badge>
          </div>
        </Card>
      </div>

      {/* Settings Comparison */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Camera className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Settings Comparison</h4>
        </div>

        <div className="space-y-3">
          {settings.map((setting, index) => {
            const diff = getDifference(setting.value1, setting.value2);
            
            return (
              <div key={index} className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {setting.name}
                </div>
                <div className="flex items-center justify-between">
                  <div className={`flex-1 p-2 rounded text-sm text-center ${
                    diff === 'same' ? 'bg-muted' : 
                    diff === 'lower' ? 'bg-accent/10 border border-accent/20' : 
                    'bg-muted'
                  }`}>
                    <div className="font-semibold">{setting.value1}</div>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground mx-3 flex-shrink-0" />
                  
                  <div className={`flex-1 p-2 rounded text-sm text-center ${
                    diff === 'same' ? 'bg-muted' : 
                    diff === 'higher' ? 'bg-primary/10 border border-primary/20' : 
                    'bg-muted'
                  }`}>
                    <div className="font-semibold">{setting.value2}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Score Impact */}
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Score Impact</h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{photo1.score}</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-bold text-accent">{photo2.score}</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {photo2.score > photo1.score 
              ? `Settings improved your score by ${photo2.score - photo1.score} points` 
              : photo2.score < photo1.score
              ? `Consider using settings from ${photo1.label}`
              : 'Both photos have the same score'}
          </p>
        </div>
      </Card>
    </div>
  );
}