import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { MessageSquare, Heart, Sparkles, Users } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { GenreBadge } from './GenreBadge';

interface CommunityPostCardProps {
  id: string;
  author: string;
  imageUrl: string;
  aiScore: number;
  communityScore: number;
  genre: 'Portrait' | 'Street' | 'Landscape' | 'Architecture' | 'Food' | 'Wildlife';
  timestamp: string;
  commentCount: number;
  isWatermarked?: boolean;
  onViewDetails?: () => void;
  onComment?: () => void;
  className?: string;
}

export function CommunityPostCard({ 
  id,
  author,
  imageUrl, 
  aiScore,
  communityScore,
  genre,
  timestamp,
  commentCount,
  isWatermarked = true,
  onViewDetails,
  onComment,
  className = '' 
}: CommunityPostCardProps) {
  const initials = author.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <Card className={`overflow-hidden border-none shadow-sm active:scale-[0.995] transition-transform ${className}`}>
      {/* Header */}
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center ring-2 ring-primary/10">
            <span className="text-xs font-semibold">{initials}</span>
          </div>
          <div>
            <h4 className="text-sm font-medium">{author}</h4>
            <p className="text-[10px] text-muted-foreground">{timestamp}</p>
          </div>
        </div>
        <GenreBadge genre={genre} size="sm" />
      </div>

      {/* Image */}
      <div className="relative w-full aspect-[4/3] bg-muted" onClick={onViewDetails}>
        <ImageWithFallback
          src={imageUrl}
          alt={`${genre} photo by ${author}`}
          className="w-full h-full object-cover cursor-pointer"
        />
        {/* Score overlays */}
        <div className="absolute bottom-2 left-2 flex space-x-1.5">
          <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Sparkles className="h-3 w-3 text-[#2962FF]" />
            <span className="font-medium tabular-nums">{aiScore}</span>
          </div>
          <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            <Users className="h-3 w-3 text-[#00C853]" />
            <span className="font-medium tabular-nums">{communityScore}</span>
          </div>
        </div>
        {isWatermarked && (
          <div className="absolute bottom-2 right-2 bg-black/40 backdrop-blur-sm text-white/70 text-[9px] px-1.5 py-0.5 rounded">
            PhotoSensei
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 py-2.5 flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 px-2 flex items-center space-x-1.5 text-muted-foreground"
          onClick={onComment}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="text-xs">{commentCount}</span>
        </Button>
        <Button size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground">
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
