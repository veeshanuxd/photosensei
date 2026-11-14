import React from 'react';

interface OverlayButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function OverlayButton({ icon, label, active = false, onClick, className = '' }: OverlayButtonProps) {
  return (
    <button 
      className={`h-14 w-full flex flex-col items-center justify-center space-y-1 rounded-xl transition-all duration-200 active:scale-95 ${
        active 
          ? 'bg-primary text-white shadow-md shadow-primary/20' 
          : 'bg-muted/50 text-muted-foreground hover:bg-muted'
      } ${className}`}
      onClick={onClick}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
