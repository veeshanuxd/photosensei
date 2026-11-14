import React from 'react';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function ErrorState({ 
  title, 
  description, 
  actionLabel = "Try Again", 
  onRetry, 
  onCancel,
  variant = 'default',
  className = '' 
}: ErrorStateProps) {
  const iconColor = variant === 'destructive' ? 'text-destructive' : 'text-warning';
  const bgColor = variant === 'destructive' ? 'from-destructive/10 to-destructive/5' : 'from-warning/10 to-warning/5';

  return (
    <div className={`text-center space-y-6 py-12 px-6 ${className}`}>
      <Card className={`p-8 bg-gradient-to-br ${bgColor} border-none shadow-lg`}>
        <div className="space-y-6">
          <div className={`w-16 h-16 mx-auto rounded-full bg-background flex items-center justify-center ${iconColor}`}>
            <AlertTriangle className="h-8 w-8" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
          </div>
          
          <div className="flex flex-col space-y-3">
            {onRetry && (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {actionLabel}
              </Button>
            )}
            
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}