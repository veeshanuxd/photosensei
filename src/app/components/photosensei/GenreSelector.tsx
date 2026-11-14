import React from 'react';
import { Card } from '../ui/card';
import { Check } from 'lucide-react';

interface GenreSelectorProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  className?: string;
}

export function GenreSelector({ 
  selectedGenres, 
  onGenreToggle,
  className = '' 
}: GenreSelectorProps) {
  const genres = [
    { name: 'Portrait', icon: '👤', description: 'Face detection, eye sharpness, skin tone' },
    { name: 'Street', icon: '🏙️', description: 'Timing, candid moments, urban context' },
    { name: 'Landscape', icon: '🏔️', description: 'Depth, sky balance, foreground interest' },
    { name: 'Architecture', icon: '🏛️', description: 'Lines, symmetry, perspective correction' },
    { name: 'Food', icon: '🍽️', description: 'Color saturation, styling, overhead angle' },
    { name: 'Wildlife', icon: '🦅', description: 'Subject isolation, sharpness, behavior' }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {genres.map((genre) => {
        const isSelected = selectedGenres.includes(genre.name);
        return (
          <Card 
            key={genre.name}
            className={`p-4 cursor-pointer transition-all ${
              isSelected 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }`}
            onClick={() => onGenreToggle(genre.name)}
          >
            <div className="flex items-start space-x-3">
              <div className="text-2xl flex-shrink-0">{genre.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{genre.name}</h4>
                  {isSelected && (
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {genre.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}