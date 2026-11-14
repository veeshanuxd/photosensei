import React from 'react';

interface GenreChipProps {
  label: string;
  confidence?: number;
  variant?: 'default' | 'secondary';
  className?: string;
}

export function GenreChip({ label, confidence, variant = 'default', className = '' }: GenreChipProps) {
  const baseClasses = "inline-flex items-center px-4 py-2 rounded-none text-sm font-medium transition-all duration-200";
  const variantClasses = {
    default: "bg-primary text-primary-foreground border border-border shadow-none",
    secondary: "bg-muted text-muted-foreground border border-border hover:bg-accent"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {label}
      {confidence && (
        <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-none font-mono">
          {confidence}%
        </span>
      )}
    </div>
  );
}