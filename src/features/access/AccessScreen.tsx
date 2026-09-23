import React, { useState } from 'react';
import { Sparkles, Shield, AlertCircle, ArrowRight, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const AccessScreen: React.FC = () => {
  const {
    passwordRequired,
    isLoading: isAuthLoading,
    sessionExpired,
    clearSessionExpiredAlert,
    error: authError,
    login,
  } = useAuth();

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!dob.trim()) {
      setFormError('Please enter your date of birth.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (passwordRequired && !password.trim()) {
      setFormError('Access password is required by server configuration.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        name,
        dob,
        gender,
        email,
        password: passwordRequired ? password : '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Subtle technical background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Session Expired Banner */}
        {sessionExpired && (
          <div className="mb-4 p-3 rounded-xl bg-surface border border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs flex items-center justify-between shadow-subtle">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Your session has expired. Please authenticate to continue.</span>
            </div>
            <button
              onClick={clearSessionExpiredAlert}
              className="text-foreground-subtle hover:text-foreground text-xs ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Access Box */}
        <div className="bg-surface border border-border-strong/60 rounded-2xl p-6 sm:p-8 shadow-card dark:shadow-card-dark">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-12 h-12 rounded-xl bg-foreground text-background flex items-center justify-center font-bold mb-4 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              OCR Intelligence
            </h1>
            <p className="text-xs text-foreground-muted mt-1 max-w-xs">
              Autonomous Financial Document Intelligence & Reconciliation Engine
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-elevated border border-border text-[11px] font-mono text-foreground-subtle">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>STATELEN-AUTH GATEWAY</span>
            </div>
          </div>

          {/* Error Message */}
          {(formError || authError) && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{formError || authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Ateeb"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting || isAuthLoading}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Date of Birth"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                disabled={isSubmitting || isAuthLoading}
                required
              />
              <Select
                label="Gender"
                options={genderOptions}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                disabled={isSubmitting || isAuthLoading}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isAuthLoading}
              required
            />

            {/* Conditionally rendered password gate */}
            {passwordRequired && (
              <div className="pt-1">
                <Input
                  label="Access Password"
                  type="password"
                  placeholder="Enter system access password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting || isAuthLoading}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full justify-center"
                isLoading={isSubmitting || isAuthLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Authenticate & Enter
              </Button>
            </div>
          </form>

          {/* Subtle Security Footnote */}
          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-[11px] text-foreground-subtle">
              Zero tolerance verification • Server-authoritative HMAC token
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
