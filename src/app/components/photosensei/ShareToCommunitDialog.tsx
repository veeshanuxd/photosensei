import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Shield, Eye, ImageIcon, X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ShareToCommunityDialogProps {
  imageUrl: string;
  aiScore: number;
  genre: string;
  onShare?: (options: ShareOptions) => void;
  onCancel?: () => void;
  className?: string;
}

interface ShareOptions {
  addWatermark: boolean;
  hideExif: boolean;
  allowComments: boolean;
  caption?: string;
}

export function ShareToCommunityDialog({ 
  imageUrl, 
  aiScore,
  genre,
  onShare, 
  onCancel,
  className = '' 
}: ShareToCommunityDialogProps) {
  const [caption, setCaption] = useState('');
  const [options, setOptions] = useState<ShareOptions>({
    addWatermark: true,
    hideExif: true,
    allowComments: true
  });

  const handleShare = () => {
    onShare?.({ ...options, caption });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Share to Community</h3>
        <Button size="icon" variant="ghost" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <Label>Preview</Label>
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
          <ImageWithFallback
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {options.addWatermark && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              PhotoSensei
            </div>
          )}
          <div className="absolute top-2 left-2 flex space-x-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              AI Score: {aiScore}
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              {genre}
            </Badge>
          </div>
        </div>
      </div>

      {/* Caption */}
      <div className="space-y-3">
        <Label htmlFor="caption">Caption (Optional)</Label>
        <Textarea
          id="caption"
          placeholder="Share your thoughts about this photo..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={280}
          className="resize-none h-20"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Add context for community feedback</span>
          <span>{caption.length}/280</span>
        </div>
      </div>

      {/* Safe Sharing Controls */}
      <Card className="p-4 space-y-4 bg-primary/5 border-primary/20">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <h4 className="font-medium">Safe Sharing Controls</h4>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="watermark"
              checked={options.addWatermark}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, addWatermark: checked as boolean }))
              }
            />
            <div className="space-y-1 flex-1">
              <Label htmlFor="watermark" className="cursor-pointer">
                Add PhotoSensei watermark
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Helps protect your work and credits the platform
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="hideExif"
              checked={options.hideExif}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, hideExif: checked as boolean }))
              }
            />
            <div className="space-y-1 flex-1">
              <Label htmlFor="hideExif" className="cursor-pointer">
                Hide EXIF metadata
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Removes camera settings and location data for privacy
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="comments"
              checked={options.allowComments}
              onCheckedChange={(checked) => 
                setOptions(prev => ({ ...prev, allowComments: checked as boolean }))
              }
            />
            <div className="space-y-1 flex-1">
              <Label htmlFor="comments" className="cursor-pointer">
                Allow community comments
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Let others provide feedback on your photo
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
        <Eye className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          By sharing to community, you agree to make this photo publicly visible. 
          You can delete it anytime from your profile.
        </p>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-primary to-accent" 
          onClick={handleShare}
        >
          Share to Community
        </Button>
      </div>
    </div>
  );
}