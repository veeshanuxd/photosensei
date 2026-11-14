import React from 'react';
import { Upload, ImagePlus } from 'lucide-react';

interface UploadBoxProps {
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
}

export function UploadBox({ 
  title = "Drag & drop your photo here", 
  subtitle = "or tap to browse",
  className = '',
  onClick 
}: UploadBoxProps) {
  return (
    <div 
      className={`border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center space-y-3 cursor-pointer hover:border-primary/40 active:scale-[0.99] transition-all bg-primary/3 ${className}`}
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center">
        <ImagePlus className="h-7 w-7 text-primary" />
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
