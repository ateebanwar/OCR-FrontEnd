export interface AccessStatusData {
  passwordRequired: boolean;
}

export interface VerifyAccessPayload {
  name: string;
  dob: string;
  gender: string;
  email: string;
  password?: string;
}

export interface VerifyAccessData {
  authenticated: boolean;
  accessToken: string;
}

export interface UserProfile {
  name: string;
  dob: string;
  gender: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  profile: UserProfile | null;
  passwordRequired: boolean;
  isLoading: boolean;
  error: string | null;
}
