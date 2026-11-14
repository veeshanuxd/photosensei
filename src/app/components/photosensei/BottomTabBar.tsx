import React from 'react';
import { Home, Camera, Users, BookOpen, User } from 'lucide-react';

type TabId = 'home' | 'live-shoot' | 'community' | 'learn' | 'profile';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  className?: string;
}

export function BottomTabBar({ activeTab, onTabChange, className = '' }: BottomTabBarProps) {
  const tabs: { id: TabId; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'community', label: 'Community', icon: <Users className="h-5 w-5" />, badge: true },
    { id: 'live-shoot', label: 'Shoot', icon: <Camera className="h-5 w-5" /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <div className={`bg-background/95 backdrop-blur-xl border-t border-border/10 px-2 py-4 h-16 ${className}`}>
      <div className="flex items-center justify-around h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center justify-center py-2 px-4 transition-all active:scale-95 ${
                isActive ? 'text-foreground opacity-100' : 'text-muted-foreground opacity-40 hover:opacity-75'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && !isActive && (
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-foreground rounded-full" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}