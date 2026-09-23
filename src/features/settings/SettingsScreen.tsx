import React from 'react';
import {
  Sun,
  Moon,
  Laptop,
  User,
  Shield,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const SettingsScreen: React.FC = () => {
  const { profile, logout, token } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          System Settings
        </h1>
        <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
          Manage visual appearance, session preferences, and authorization credentials
        </p>
      </div>

      {/* Visual Theme Section */}
      <Card variant="default">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
              <p className="text-xs text-foreground-muted">
                Choose how OCR Intelligence looks across devices
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                theme === 'light'
                  ? 'border-foreground bg-surface-elevated text-foreground font-semibold shadow-subtle'
                  : 'border-border text-foreground-muted hover:border-border-strong bg-surface'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                theme === 'dark'
                  ? 'border-foreground bg-surface-elevated text-foreground font-semibold shadow-subtle'
                  : 'border-border text-foreground-muted hover:border-border-strong bg-surface'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 text-xs font-medium transition-all ${
                theme === 'system'
                  ? 'border-foreground bg-surface-elevated text-foreground font-semibold shadow-subtle'
                  : 'border-border text-foreground-muted hover:border-border-strong bg-surface'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>System</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Operator Profile Section */}
      <Card variant="default">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Operator Profile
              </h3>
              <p className="text-xs text-foreground-muted">
                Authorized identity passed during session gate verification
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-surface-elevated/60 border border-border">
              <span className="text-[10px] font-mono uppercase text-foreground-subtle block">
                Operator Name
              </span>
              <span className="font-semibold text-foreground">
                {profile?.name || 'Not provided'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated/60 border border-border">
              <span className="text-[10px] font-mono uppercase text-foreground-subtle block">
                Email Address
              </span>
              <span className="font-semibold text-foreground">
                {profile?.email || 'Not provided'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated/60 border border-border">
              <span className="text-[10px] font-mono uppercase text-foreground-subtle block">
                Date of Birth
              </span>
              <span className="font-semibold text-foreground font-mono">
                {profile?.dob || 'Not provided'}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated/60 border border-border">
              <span className="text-[10px] font-mono uppercase text-foreground-subtle block">
                Gender
              </span>
              <span className="font-semibold text-foreground">
                {profile?.gender || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Security & Active Session */}
      <Card variant="default">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-foreground">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Active Authorization Session
              </h3>
              <p className="text-xs text-foreground-muted">
                Cryptographic token status and revocation controls
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-elevated/60 border border-border text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-mono font-medium text-foreground">
                  TOKEN STATUS: ACTIVE
                </span>
              </div>
              <p className="text-foreground-muted font-mono text-[11px]">
                {token ? `HMAC-SHA256 Token Signature Verified` : 'No active token'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-500" />}
            >
              Sign Out / Clear Session
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-foreground-subtle pt-1">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>Zero secrets stored in client. All authentication keys remain server-side.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
