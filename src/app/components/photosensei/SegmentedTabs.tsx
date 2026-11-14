import React from 'react';

interface SegmentedTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function SegmentedTabs({ tabs, activeTab, onTabChange, className = '' }: SegmentedTabsProps) {
  return (
    <div className={`p-1 bg-muted rounded-xl ${className}`}>
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`
              px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200
              ${activeTab === tab 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}