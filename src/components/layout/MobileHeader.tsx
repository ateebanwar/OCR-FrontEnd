import React from 'react';
import { Menu, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  title: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenSidebar,
  title,
}) => {
  const { effectiveTheme, toggleTheme } = useTheme();

  return (
    <header className="lg:hidden h-14 bg-surface border-b border-border flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
          className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-foreground text-background flex items-center justify-center font-bold text-[10px]">
            <Sparkles className="w-3 h-3" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-foreground">
            {title}
          </span>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
      >
        {effectiveTheme === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-zinc-500" />
        )}
      </button>
    </header>
  );
};
