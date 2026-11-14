import React from 'react';
import { Switch } from '../ui/switch';
import { Grid3X3, Compass } from 'lucide-react';
import { Card } from '../ui/card';

interface SidePanelOverlaysProps {
  overlayStates: {
    thirds: boolean;
    horizon: boolean;
    crop: boolean;
    lines: boolean;
  };
  onOverlayChange: (overlay: string, value: boolean) => void;
  className?: string;
}

export function SidePanelOverlays({ overlayStates, onOverlayChange, className = '' }: SidePanelOverlaysProps) {
  const overlays = [
    { key: 'thirds', label: 'Rule of Thirds', icon: <Grid3X3 className="h-4 w-4" /> },
    { key: 'horizon', label: 'Horizon Line', icon: <div className="w-4 h-px bg-current" /> },
    { key: 'crop', label: 'Crop Guide', icon: <div className="w-4 h-4 border border-dashed border-current rounded" /> },
    { key: 'lines', label: 'Leading Lines', icon: <Compass className="h-4 w-4" /> }
  ];

  return (
    <Card className={`p-4 space-y-4 ${className}`}>
      <h3 className="font-semibold text-sm">Visual Overlays</h3>
      <div className="space-y-4">
        {overlays.map((overlay) => (
          <div key={overlay.key} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-muted-foreground">{overlay.icon}</div>
              <label className="text-sm font-medium cursor-pointer">
                {overlay.label}
              </label>
            </div>
            <Switch
              checked={overlayStates[overlay.key as keyof typeof overlayStates]}
              onCheckedChange={(checked) => onOverlayChange(overlay.key, checked)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}