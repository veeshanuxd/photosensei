import React from 'react';
import { Switch } from '../ui/switch';

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function SettingsToggle({ label, description, checked, onCheckedChange, className = '' }: SettingsToggleProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="space-y-0.5 flex-1 pr-4">
        <label className="text-sm font-medium cursor-pointer" onClick={() => onCheckedChange(!checked)}>
          {label}
        </label>
        {description && (
          <p className="text-[11px] text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
