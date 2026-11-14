import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface AnalysisStep {
  name: string;
  status: 'complete' | 'in-progress' | 'pending';
}

interface AnalysisProgressProps {
  steps: AnalysisStep[];
  progress: number;
  currentStep?: string;
  className?: string;
}

export function AnalysisProgress({ steps, progress, currentStep, className = '' }: AnalysisProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 200);
    return () => clearTimeout(timer);
  }, [progress]);

  const getStepIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'complete':
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C853] to-[#4CAF50] flex items-center justify-center shadow-sm">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2962FF] to-[#5E8AFF] flex items-center justify-center shadow-sm shadow-primary/20">
            <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
          </div>
        );
      default:
        return <div className="w-7 h-7 rounded-full border-2 border-muted-foreground/20 bg-muted/30" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{currentStep}</span>
          <span className="text-primary font-medium tabular-nums">{animatedProgress}%</span>
        </div>
        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2962FF] to-[#00C853] rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Steps */}
      <div className="space-y-1">
        {steps.map((step, index) => (
          <div key={step.name} className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              {getStepIcon(step.status)}
              <span className={`text-sm ${
                step.status === 'complete' ? 'text-foreground' :
                step.status === 'in-progress' ? 'text-primary font-medium' :
                'text-muted-foreground'
              }`}>{step.name}</span>
            </div>
            <span className={`text-xs ${
              step.status === 'complete' ? 'text-[#00C853] font-medium' :
              step.status === 'in-progress' ? 'text-primary' :
              'text-muted-foreground/50'
            }`}>
              {step.status === 'in-progress' ? 'Analyzing...' : 
               step.status === 'complete' ? 'Done' : 'Waiting'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
