import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AccessScreen } from './features/access/AccessScreen';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/Sidebar';
import { HomeScreen } from './features/home/HomeScreen';
import { GeneratorScreen } from './features/generator/GeneratorScreen';
import { SettingsScreen } from './features/settings/SettingsScreen';
import { AboutScreen } from './features/about/AboutScreen';
import { Loader2 } from 'lucide-react';

import { GeneratorProvider } from './context/GeneratorContext';

export const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  if (isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-foreground" />
          <span className="text-xs font-mono text-foreground-muted">
            Connecting to OCR Intelligence...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessScreen />;
  }

  return (
    <GeneratorProvider>
      <AppLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
        {currentTab === 'home' && <HomeScreen onNavigate={setCurrentTab} />}
        {currentTab === 'generator' && <GeneratorScreen />}
        {currentTab === 'settings' && <SettingsScreen />}
        {currentTab === 'about' && <AboutScreen />}
      </AppLayout>
    </GeneratorProvider>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
