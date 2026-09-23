import { apiClient } from './apiClient';
import { AccessStatusData, VerifyAccessPayload, VerifyAccessData } from '../types/auth';

export const accessService = {
  /**
   * Fetches whether the backend requires a password gate.
   */
  async getAccessStatus(): Promise<AccessStatusData> {
    return apiClient.get<AccessStatusData>('/api/v1/access/status');
  },

  /**
   * Submits credentials for backend authentication and retrieves the access token.
   */
  async verifyAccess(payload: VerifyAccessPayload): Promise<VerifyAccessData> {
    // If password is not provided or not required, send compliant string to pass backend schema
    const formattedPayload = {
      name: payload.name.trim(),
      dob: payload.dob.trim(),
      gender: payload.gender.trim(),
      email: payload.email.trim(),
      password: payload.password?.trim() || 'not-required',
    };

    return apiClient.post<VerifyAccessData>('/api/v1/access/verify', formattedPayload);
  },
};
