import React, { useState } from 'react';
import { Button } from '../ui/button';
import { EXIFComparisonChart } from './EXIFComparisonChart';
import { FocalLengthHeatmap } from './FocalLengthHeatmap';
import { EXIFRecommendationCard } from './EXIFRecommendationCard';
import { EXIFCompareMode } from './EXIFCompareMode';
import { GitCompare } from 'lucide-react';

interface EXIFInsightPanelProps {
  genre: string;
  currentSettings: {
    aperture: string;
    shutter: string;
    iso: string;
    focalLength: string;
  };
  currentPhoto: string;
  currentScore: number;
  className?: string;
}

export function EXIFInsightPanel({ 
  genre, 
  currentSettings,
  currentPhoto,
  currentScore,
  className = '' 
}: EXIFInsightPanelProps) {
  const [compareMode, setCompareMode] = useState(false);

  // Sample data - would come from user's photo history
  const focalLengthData = [
    { range: '24-35mm', count: 45, percentage: 28 },
    { range: '50-70mm', count: 82, percentage: 51 },
    { range: '85-105mm', count: 28, percentage: 17 },
    { range: '135-200mm', count: 5, percentage: 3 },
    { range: '200mm+', count: 1, percentage: 1 },
    { range: '<24mm', count: 0, percentage: 0 }
  ];

  // Dynamic EXIF Analyzer logic based on photography principles
  const getEXIFAnalysis = () => {
    const apertureVal = parseFloat(currentSettings.aperture.replace('f/', '')) || 4.0;
    const isoVal = parseInt(currentSettings.iso) || 400;
    
    let shutterVal = 125;
    if (currentSettings.shutter.includes('/')) {
      shutterVal = parseInt(currentSettings.shutter.split('/')[1]) || 125;
    } else {
      shutterVal = 1 / (parseFloat(currentSettings.shutter) || 1);
    }
    
    const focalVal = parseFloat(currentSettings.focalLength) || 85;

    let shutterIdeal = '1/250s or faster';
    let shutterStatus: 'good' | 'warning' | 'risk' = 'good';
    let shutterTooltip = `Shutter speed of ${currentSettings.shutter} is safe for handheld shots with a ${currentSettings.focalLength} lens.`;

    let apertureIdeal = 'f/1.8 - f/4.0';
    let apertureStatus: 'good' | 'warning' | 'risk' = 'good';
    let apertureTooltip = `Aperture of ${currentSettings.aperture} provides a shallow depth of field, ideal for portrait isolating background.`;

    let isoIdeal = '100 - 800';
    let isoStatus: 'good' | 'warning' | 'risk' = 'good';
    let isoTooltip = `ISO of ${currentSettings.iso} is clean with negligible digital noise.`;

    let focalIdeal = '50 - 135mm';
    let focalStatus: 'good' | 'warning' | 'risk' = 'good';
    let focalTooltip = `${currentSettings.focalLength} is a classic portrait range that avoids wide-angle facial distortion.`;

    const isLandscape = genre === 'Landscape' || genre === 'Nature';
    const isGroup = genre === 'People' || genre === 'Group Portrait';

    if (isLandscape) {
      shutterIdeal = '1/60s or faster';
      apertureIdeal = 'f/8.0 - f/16.0';
      isoIdeal = '100 - 200';
      focalIdeal = '14 - 35mm';

      if (apertureVal < 5.6) {
        apertureStatus = 'warning';
        apertureTooltip = `At ${currentSettings.aperture}, focus depth is too narrow for landscapes. Consider f/8 or f/11 for edge-to-edge sharpness.`;
      } else {
        apertureTooltip = `Aperture ${currentSettings.aperture} is optimal for capturing a wide depth of field.`;
      }

      if (isoVal > 400) {
        isoStatus = 'warning';
        isoTooltip = `ISO ${currentSettings.iso} is high for landscapes. Reduce it to ISO 100 or 200 to capture widest dynamic range.`;
      }

      if (focalVal > 50) {
        focalStatus = 'warning';
        focalTooltip = `${currentSettings.focalLength} is telephoto. Try wide-angle focal lengths (14-35mm) to capture vastness.`;
      }
    } else if (isGroup) {
      shutterIdeal = '1/200s or faster';
      apertureIdeal = 'f/4.0 - f/8.0';
      isoIdeal = '100 - 800';
      focalIdeal = '24 - 70mm';

      if (apertureVal <= 2.8) {
        apertureStatus = 'warning';
        apertureTooltip = `At ${currentSettings.aperture}, depth of field is very shallow. With multiple subjects standing in layers, f/2.8 will leave some faces out of focus. Use f/4.0 or f/5.6.`;
      } else {
        apertureTooltip = `Aperture ${currentSettings.aperture} is ideal for keeping all group members sharp.`;
      }

      if (shutterVal < 200) {
        shutterStatus = 'warning';
        shutterTooltip = `At ${currentSettings.shutter}, any subject movement or laughter will introduce motion blur. Use a faster shutter speed like 1/200s or 1/250s.`;
      }

      if (isoVal > 800) {
        isoStatus = 'warning';
        isoTooltip = `ISO ${currentSettings.iso} will introduce grain. Shoot in brighter light or use flash to keep ISO low.`;
      }
    } else {
      if (shutterVal < focalVal) {
        shutterStatus = 'warning';
        shutterTooltip = `At ${currentSettings.shutter} with a ${currentSettings.focalLength} lens, there is a risk of camera shake blur. Handheld rule suggests 1/${Math.round(focalVal)}s or faster.`;
      }

      if (apertureVal > 5.6) {
        apertureStatus = 'warning';
        apertureTooltip = `Aperture ${currentSettings.aperture} is too closed for subject separation. Open it to f/2.8 or wider for soft bokeh.`;
      }

      if (isoVal > 800) {
        isoStatus = 'warning';
        isoTooltip = `ISO ${currentSettings.iso} will introduce color noise and grain. Shoot in brighter light or open aperture to lower ISO.`;
      }
    }

    return {
      settings: [
        { name: 'Shutter Speed', current: currentSettings.shutter, ideal: shutterIdeal, status: shutterStatus, tooltip: shutterTooltip },
        { name: 'Aperture', current: currentSettings.aperture, ideal: apertureIdeal, status: apertureStatus, tooltip: apertureTooltip },
        { name: 'ISO', current: currentSettings.iso, ideal: isoIdeal, status: isoStatus, tooltip: isoTooltip },
        { name: 'Focal Length', current: currentSettings.focalLength, ideal: focalIdeal, status: focalStatus, tooltip: focalTooltip }
      ],
      recommendations: [
        {
          setting: 'Aperture',
          current: currentSettings.aperture,
          suggested: isLandscape ? 'f/8.0' : (isGroup ? 'f/4.0' : 'f/2.8'),
          reason: isLandscape 
            ? 'Stop down to ensure both foreground features and background vistas are completely sharp.' 
            : (isGroup 
                ? 'Stop down to f/4.0 or f/5.6 to deepen the focal plane so everyone in the group is sharp.'
                : 'Open the aperture to isolate your portrait subject with clean background bokeh.'),
          impact: 'high' as const
        },
        {
          setting: 'ISO',
          current: currentSettings.iso,
          suggested: 'ISO 100',
          reason: 'Lowering ISO ensures highest signal-to-noise ratio, preserving finest highlight details.',
          impact: 'medium' as const
        }
      ]
    };
  };

  const analysis = getEXIFAnalysis();
  const comparisonSettings = analysis.settings;
  const recommendations = analysis.recommendations;

  // Comparison photos data
  const photo1 = {
    id: '1',
    imageUrl: currentPhoto,
    score: currentScore,
    exif: currentSettings,
    label: 'Current Photo'
  };

  const photo2 = {
    id: '2',
    imageUrl: currentPhoto,
    score: 88,
    exif: {
      aperture: 'f/4',
      shutter: '1/250s',
      iso: '640',
      focalLength: '85mm'
    },
    label: 'Previous Best'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">EXIF Insights</h3>
        <Button
          size="sm"
          variant={compareMode ? 'default' : 'outline'}
          className={compareMode ? 'bg-gradient-to-r from-primary to-accent' : ''}
          onClick={() => setCompareMode(!compareMode)}
        >
          <GitCompare className="h-4 w-4 mr-2" />
          {compareMode ? 'Exit Compare' : 'Compare Session'}
        </Button>
      </div>

      {compareMode ? (
        <EXIFCompareMode photo1={photo1} photo2={photo2} />
      ) : (
        <>
          <EXIFComparisonChart
            genre={genre}
            settings={comparisonSettings}
          />

          <FocalLengthHeatmap data={focalLengthData} />

          <EXIFRecommendationCard
            recommendations={recommendations}
            onApplyTip={(setting) => {
              console.log('Remembering tip for:', setting);
            }}
          />
        </>
      )}
    </div>
  );
}