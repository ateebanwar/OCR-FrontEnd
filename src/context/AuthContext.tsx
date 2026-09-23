import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserProfile, VerifyAccessPayload } from '../types/auth';
import { accessService } from '../services/accessService';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  profile: UserProfile | null;
  passwordRequired: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  error: string | null;
  login: (payload: VerifyAccessPayload) => Promise<boolean>;
  logout: () => void;
  clearSessionExpiredAlert: () => void;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'ocr_token';
const PROFILE_KEY = 'ocr_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });

  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [passwordRequired, setPasswordRequired] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    setTokenState(null);
    sessionStorage.removeItem(TOKEN_KEY);
    apiClient.setToken(null);
  }, []);

  const handleUnauthorized = useCallback(() => {
    logout();
    setSessionExpired(true);
  }, [logout]);

  useEffect(() => {
    // Configure API client with current token and 401 callback
    apiClient.setToken(token);
    apiClient.setOnUnauthorized(handleUnauthorized);
  }, [token, handleUnauthorized]);

  // Query /api/v1/access/status on startup
  const refreshStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const statusData = await accessService.getAccessStatus();
      setPasswordRequired(statusData.passwordRequired);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unable to reach authentication service. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const login = async (payload: VerifyAccessPayload): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      setSessionExpired(false);

      const result = await accessService.verifyAccess(payload);

      if (result.authenticated && result.accessToken) {
        const userProfile: UserProfile = {
          name: payload.name.trim(),
          dob: payload.dob.trim(),
          gender: payload.gender.trim(),
          email: payload.email.trim(),
        };

        setTokenState(result.accessToken);
        sessionStorage.setItem(TOKEN_KEY, result.accessToken);
        apiClient.setToken(result.accessToken);

        setProfileState(userProfile);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(userProfile));
        return true;
      } else {
        setError('Authentication could not be completed.');
        return false;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Clean error message without exposing backend details or passwords
        setError(err.message.includes('credential') || err.message.includes('Password')
          ? 'Invalid access credentials. Please try again.'
          : err.message);
      } else {
        setError('Authentication failed. Please verify your details.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearSessionExpiredAlert = () => {
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        token,
        profile,
        passwordRequired,
        isLoading,
        sessionExpired,
        error,
        login,
        logout,
        clearSessionExpiredAlert,
        refreshStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
