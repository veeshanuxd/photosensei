import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Award, Verified } from 'lucide-react';

interface CertificatePreviewProps {
  userName: string;
  certificationName: string;
  completionDate: string;
  lessonsCompleted: number;
  badgesEarned: number;
  overallScore: number;
  certificateId: string;
  className?: string;
}

export function CertificatePreview({ 
  userName,
  certificationName,
  completionDate,
  lessonsCompleted,
  badgesEarned,
  overallScore,
  certificateId,
  className = '' 
}: CertificatePreviewProps) {
  return (
    <Card className={`p-8 space-y-6 bg-gradient-to-br from-background via-primary/5 to-accent/5 border-2 border-primary/20 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <Award className="h-10 w-10 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Certificate of Achievement
          </h2>
          <p className="text-sm text-muted-foreground">PhotoSensei Learning Journey</p>
        </div>
      </div>

      {/* Body */}
      <div className="text-center space-y-4 py-4">
        <p className="text-sm text-muted-foreground">This certifies that</p>
        <h3 className="text-2xl font-bold">{userName}</h3>
        <p className="text-sm text-muted-foreground">has successfully completed the</p>
        <h4 className="text-xl font-semibold text-primary">{certificationName}</h4>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/50">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{lessonsCompleted}</div>
          <div className="text-xs text-muted-foreground">Lessons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-accent">{badgesEarned}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{overallScore}</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Completion Date:</span>
          <span className="font-medium">{completionDate}</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 pt-2">
          <Verified className="h-4 w-4 text-accent" />
          <span className="text-xs text-muted-foreground">Certificate ID: {certificateId}</span>
        </div>
        
        <div className="text-center pt-4">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            Verified by PhotoSensei
          </Badge>
        </div>
      </div>
    </Card>
  );
}