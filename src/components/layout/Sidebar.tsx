import React from 'react';
import {
  FileSpreadsheet,
  Home,
  Settings,
  Info,
  Sun,
  Moon,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export type NavTab = 'home' | 'generator' | 'settings' | 'about';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onCloseMobile,
}) => {
  const { profile, logout } = useAuth();
  const { effectiveTheme, toggleTheme } = useTheme();

  const handleNav = (tab: NavTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode }> = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'generator',
      label: 'Generator',
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: 'about',
      label: 'About',
      icon: <Info className="w-4 h-4" />,
    },
  ];

  // User initials for avatar
  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <aside className="w-64 h-full bg-surface border-r border-border flex flex-col justify-between p-4 select-none">
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-2.5 px-3 py-3 mb-6 border-b border-border/60">
          <div className="w-7 h-7 rounded-lg bg-foreground text-background flex items-center justify-center font-bold text-xs shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-foreground">
              OCR Intelligence
            </span>
            <span className="text-[10px] font-mono text-foreground-subtle tracking-wider uppercase">
              Financial Engine
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 ${
                  isActive
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme, Profile, Sign Out */}
      <div className="pt-4 border-t border-border space-y-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          title="Toggle Light / Dark mode"
        >
          <span className="flex items-center gap-3">
            {effectiveTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-500" />
            )}
            <span>Theme</span>
          </span>
          <span className="font-mono text-[10px] uppercase text-foreground-subtle">
            {effectiveTheme}
          </span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-surface-elevated/70 border border-border/50">
          <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {profile?.name || 'Authorized User'}
            </p>
            {profile?.email && (
              <p className="text-[10px] text-foreground-subtle truncate">
                {profile.email}
              </p>
            )}
          </div>
          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="p-1.5 text-foreground-subtle hover:text-rose-500 rounded-md hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
