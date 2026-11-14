import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { GraduationCap, Download } from 'lucide-react';

interface CertificationPathCardProps {
  certificationName: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  badgesRequired: number;
  badgesEarned: number;
  unlocked?: boolean;
  onDownloadCertificate?: () => void;
  className?: string;
}

export function CertificationPathCard({ 
  certificationName,
  description,
  totalLessons,
  completedLessons,
  badgesRequired,
  badgesEarned,
  unlocked = false,
  onDownloadCertificate,
  className = '' 
}: CertificationPathCardProps) {
  const overallProgress = ((completedLessons / totalLessons) * 70 + (badgesEarned / badgesRequired) * 30);

  return (
    <Card className={`p-6 space-y-6 ${unlocked ? 'border-2 border-accent bg-gradient-to-br from-accent/5 to-primary/5' : ''} ${className}`}>
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${unlocked ? 'bg-gradient-to-br from-primary to-accent' : 'bg-muted'}`}>
          <GraduationCap className={`h-6 w-6 ${unlocked ? 'text-white' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold">{certificationName}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Lessons</div>
            <div className="text-lg font-semibold">
              {completedLessons}/{totalLessons}
            </div>
            <Progress value={(completedLessons / totalLessons) * 100} className="h-1" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Badges</div>
            <div className="text-lg font-semibold">
              {badgesEarned}/{badgesRequired}
            </div>
            <Progress value={(badgesEarned / badgesRequired) * 100} className="h-1" />
          </div>
        </div>
      </div>

      {unlocked ? (
        <Button 
          className="w-full bg-gradient-to-r from-primary to-accent"
          onClick={onDownloadCertificate}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      ) : (
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">
            Complete all requirements to unlock
          </p>
        </div>
      )}
    </Card>
  );
}