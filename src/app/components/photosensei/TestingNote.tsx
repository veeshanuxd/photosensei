import React from 'react';
import { Card } from '../ui/card';
import { StickyNote } from 'lucide-react';

interface TestingNoteProps {
  note: string;
  variant?: 'A' | 'B';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function TestingNote({ 
  note, 
  variant, 
  position = 'top-right', 
  className = '' 
}: TestingNoteProps) {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-64 ${className}`}>
      <Card className="p-3 bg-yellow-100 border-yellow-300 shadow-lg">
        <div className="flex items-start space-x-2">
          <StickyNote className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            {variant && (
              <div className="text-xs font-bold text-yellow-800 bg-yellow-200 px-2 py-1 rounded">
                Variant {variant}
              </div>
            )}
            <p className="text-xs text-yellow-800 leading-relaxed">{note}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}