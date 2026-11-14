import React from 'react';
import { Card } from '../ui/card';
import { GenreChip } from './GenreChip';
import { CheckCircle, Lightbulb, Target } from 'lucide-react';

interface ExportCardProps {
  imageUrl: string;
  score: number;
  genre: string;
  confidence: number;
  scores: {
    framing: number;
    composition: number;
    lighting: number;
    exposure: number;
  };
  exifData: {
    aperture: string;
    shutter: string;
    iso: string;
    focalLength: string;
  };
  format?: 'mobile' | 'print';
  className?: string;
  works?: Array<{ title: string; content: string }>;
  improve?: Array<{ title: string; content: string }>;
  reshoot?: Array<{ title: string; content: string }>;
}

export function ExportCard({ 
  imageUrl, 
  score, 
  genre, 
  confidence, 
  scores, 
  exifData, 
  format = 'mobile',
  className = '',
  works,
  improve,
  reshoot
}: ExportCardProps) {
  const isMobile = format === 'mobile';
  const containerClass = isMobile 
    ? 'w-[270px] h-[338px]' // 1080x1350 aspect ratio scaled down
    : 'w-[210mm] h-[297mm]'; // A4 dimensions

  return (
    <Card className={`${containerClass} p-6 space-y-4 bg-card shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-primary">PhotoSensei</div>
        <GenreChip label={genre} confidence={confidence} variant="secondary" />
      </div>

      {/* Photo Thumbnail */}
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Critique subject"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overall Score */}
      <div className="text-center">
        <div className="text-4xl font-bold text-primary">{score}/100</div>
        <p className="text-sm text-muted-foreground">Overall Score</p>
      </div>

      {/* Pillar Scores */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { name: 'Framing', score: scores.framing, color: 'bg-[#2962FF]' },
          { name: 'Composition', score: scores.composition, color: 'bg-[#00C853]' },
          { name: 'Lighting', score: scores.lighting, color: 'bg-[#FF6D00]' },
          { name: 'Exposure', score: scores.exposure, color: 'bg-[#7C4DFF]' }
        ].map((item) => (
          <div key={item.name} className="text-center space-y-1">
            <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
            <div className="text-lg font-bold">{item.score}</div>
            <div className="text-xs text-muted-foreground">{item.name}</div>
          </div>
        ))}
      </div>

      {/* Feedback Sections */}
      <div className="space-y-3 text-[10px] overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-3 w-3 text-[#00C853]" />
            <span className="font-medium">What Works</span>
          </div>
          <ul className="ml-5 space-y-0.5 text-muted-foreground">
            {works && works.length > 0 ? (
              works.slice(0, 2).map((item, idx) => (
                <li key={idx} className="truncate">• {item.title}: {item.content}</li>
              ))
            ) : (
              <>
                <li>• Strong subject focus with shallow depth</li>
                <li>• Natural, engaging facial expression</li>
              </>
            )}
          </ul>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-3 w-3 text-[#FF6D00]" />
            <span className="font-medium">Areas to Improve</span>
          </div>
          <ul className="ml-5 space-y-0.5 text-muted-foreground">
            {improve && improve.length > 0 ? (
              improve.slice(0, 2).map((item, idx) => (
                <li key={idx} className="truncate">• {item.title}: {item.content}</li>
              ))
            ) : (
              <>
                <li>• Consider softer lighting direction</li>
                <li>• Simplify background elements</li>
              </>
            )}
          </ul>
        </div>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Target className="h-3 w-3 text-[#2962FF]" />
            <span className="font-medium">Reshoot Tips</span>
          </div>
          <ul className="ml-5 space-y-0.5 text-muted-foreground">
            {reshoot && reshoot.length > 0 ? (
              reshoot.slice(0, 2).map((item, idx) => (
                <li key={idx} className="truncate">• {item.title}: {item.content}</li>
              ))
            ) : (
              <>
                <li>• Try golden hour timing for warmer light</li>
                <li>• Use reflector to fill shadow areas</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* EXIF Data */}
      <div className="border-t pt-3">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">f-stop</div>
            <div className="font-medium">{exifData.aperture}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Shutter</div>
            <div className="font-medium">{exifData.shutter}</div>
          </div>
          <div>
            <div className="text-muted-foreground">ISO</div>
            <div className="font-medium">{exifData.iso}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Focal</div>
            <div className="font-medium">{exifData.focalLength}</div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="text-center pt-2 border-t">
        <blockquote className="text-xs italic text-muted-foreground">
          "Photography is the story I fail to put into words."
        </blockquote>
        <cite className="text-xs text-muted-foreground">— Destin Sparks</cite>
      </div>
    </Card>
  );
}