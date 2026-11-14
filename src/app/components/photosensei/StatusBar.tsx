import React, { useState, useEffect } from 'react';
import { Wifi, Signal, BatteryFull } from 'lucide-react';

interface StatusBarProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export function StatusBar({ variant = 'light', className = '' }: StatusBarProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const textColor = variant === 'dark' ? 'text-white' : 'text-foreground';

  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 ${className}`}>
      <span className={`text-sm font-semibold tabular-nums ${textColor}`}>{time}</span>
      {/* Dynamic Island placeholder */}
      <div className="w-[126px] h-[37px] bg-black rounded-full mx-auto" />
      <div className={`flex items-center space-x-1.5 ${textColor}`}>
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </div>
    </div>
  );
}
