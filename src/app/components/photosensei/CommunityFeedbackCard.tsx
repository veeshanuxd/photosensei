import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ThumbsUp, Sparkles } from 'lucide-react';

interface CommunityFeedbackCardProps {
  author: string;
  authorAvatar?: string;
  feedback: string;
  upvotes: number;
  timestamp: string;
  isUpvoted?: boolean;
  isAIHighlighted?: boolean;
  onUpvote?: () => void;
  className?: string;
}

export function CommunityFeedbackCard({ 
  author,
  authorAvatar,
  feedback, 
  upvotes, 
  timestamp,
  isUpvoted = false,
  isAIHighlighted = false,
  onUpvote,
  className = '' 
}: CommunityFeedbackCardProps) {
  return (
    <Card className={`p-4 space-y-3 ${isAIHighlighted ? 'border-primary bg-primary/5' : ''} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="font-medium text-sm">
              {author.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h5 className="font-medium text-sm">{author}</h5>
              {isAIHighlighted && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Top Feedback
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{timestamp}</p>
          </div>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          className={`flex items-center space-x-1 ${isUpvoted ? 'text-primary' : 'text-muted-foreground'}`}
          onClick={onUpvote}
        >
          <ThumbsUp className={`h-4 w-4 ${isUpvoted ? 'fill-current' : ''}`} />
          <span className="text-xs font-medium">{upvotes}</span>
        </Button>
      </div>
      
      <p className="text-sm leading-relaxed pl-13">{feedback}</p>
    </Card>
  );
}