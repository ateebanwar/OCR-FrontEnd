import React, { useState } from 'react';
import { Sidebar, NavTab } from './Sidebar';
import { MobileHeader } from './MobileHeader';

interface AppLayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const tabTitles: Record<NavTab, string> = {
    home: 'OCR Intelligence',
    generator: 'Document Generator',
    settings: 'Settings',
    about: 'About System',
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar (Persistent) */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} />
      </div>

      {/* Mobile Sidebar (Drawer with Backdrop) */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="w-64 h-full shadow-2xl animate-slideRight"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              currentTab={currentTab}
              onSelectTab={onSelectTab}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <MobileHeader
          title={tabTitles[currentTab]}
          onOpenSidebar={() => setMobileSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
