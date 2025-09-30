"use client";

import { getCookieValue } from '@/lib/utils/helpers';

// Base URL - points to our physio-backend-core
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1/';

// Response interface following clinic-web pattern
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

// Get headers with authentication and context
const getHeaders = (additionalHeaders?: Record<string, string>, url?: string) => {
  // Don't add Authorization header for auth endpoints
  const isAuthEndpoint = url && (url.includes('/auth/login') || url.includes('/auth/register'));
  const access_token = isAuthEndpoint ? null : getCookieValue('access_token');
  
  // Context headers from Redux store
  const contextHeaders: Record<string, string> = {};
  
  if (typeof window !== 'undefined') {
    try {
      // Import store dynamically to avoid circular dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { store } = require('@/store/store');
      const state = store.getState();
      const userData = state.user?.userData;
      const currentLocation = state.user?.currentLocation;
      
      // Add user context headers for marketplace
      if (userData?.id) {
        contextHeaders['x-user-id'] = userData.id;
      }
      
      if (userData?.role) {
        contextHeaders['x-user-role'] = userData.role;
      }
      
      if (currentLocation) {
        contextHeaders['x-location'] = currentLocation;
      }
    } catch (error) {
      // Store not available yet or circular dependency issue
      console.warn('Could not access Redux store for context headers');
    }
  }
  
  return {
    'Content-Type': 'application/json',
    ...(access_token && { Authorization: `Bearer ${access_token}` }),
    ...contextHeaders,
    ...additionalHeaders,
  };
};

// Get headers for file uploads (no Content-Type)
const getFileHeaders = (additionalHeaders?: Record<string, string>) => {
  const access_token = getCookieValue('access_token');
  
  const contextHeaders: Record<string, string> = {};
  
  if (typeof window !== 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { store } = require('@/store/store');
      const state = store.getState();
      const userData = state.user?.userData;
      const currentLocation = state.user?.currentLocation;
      
      if (userData?.id) {
        contextHeaders['x-user-id'] = userData.id;
      }
      
      if (userData?.role) {
        contextHeaders['x-user-role'] = userData.role;
      }
      
      if (currentLocation) {
        contextHeaders['x-location'] = currentLocation;
      }
    } catch (error) {
      console.warn('Could not access Redux store for file upload headers');
    }
  }
  
  return {
    ...(access_token && { Authorization: `Bearer ${access_token}` }),
    ...contextHeaders,
    ...additionalHeaders,
  };
};

// Response middleware for consistent error handling
const responseMiddleware = async (response: Response, url?: string): Promise<ApiResponse> => {
  try {
    const data = await response.json();

    // Handle 401 unauthorized
    if (response.status === 401) {
      // Don't auto-logout for auth endpoints (login/register)
      const isAuthEndpoint = url && (url.includes('/auth/login') || url.includes('/auth/register'));
      
      if (!isAuthEndpoint) {
        console.warn('Authentication token expired or invalid. Please login again.');
        
        // Clear invalid tokens
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const { removeAuthTokens } = require('@/lib/utils/helpers');
          removeAuthTokens();
          
          // Dispatch logout to Redux store if available
          try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { store } = require('@/store/store');
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { logoutSuccess } = require('@/store/slices/authSlice');
            store.dispatch(logoutSuccess());
          } catch (storeError) {
            console.warn('Could not access Redux store for logout');
          }
        }
      }
      
      return {
        success: false,
        statusCode: 401,
        message: 'Authentication required. Please login again.',
        error: 'Unauthorized'
      };
    }

    return data;
  } catch (error) {
    console.error('Response middleware error:', error);
    throw error;
  }
};

// Main API client class following clinic-web pattern
export class ApiMethods {
  // Generic API request method
  static async apiRequest(
    method: string,
    url: string,
    body?: unknown,
    additionalHeaders?: Record<string, string>
  ): Promise<ApiResponse> {
    const config: RequestInit = {
      method,
      headers: getHeaders(additionalHeaders, url),
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, config);
      return await responseMiddleware(response, url);
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET method
  static async get(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiRequest('GET', url, undefined, headers);
  }

  // POST method
  static async post(
    url: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiRequest('POST', url, data, headers);
  }

  // PUT method
  static async put(
    url: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiRequest('PUT', url, data, headers);
  }

  // PATCH method
  static async patch(
    url: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiRequest('PATCH', url, data, headers);
  }

  // DELETE method
  static async delete(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiRequest('DELETE', url, undefined, headers);
  }

  // File upload method
  static async apiFileRequest(
    method: string,
    url: string,
    file: File,
    fieldName: string = 'file',
    additionalHeaders?: Record<string, string>
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const config: RequestInit = {
      method,
      body: formData,
      headers: getFileHeaders(additionalHeaders),
    };

    try {
      const response = await fetch(url, config);
      return await responseMiddleware(response, url);
    } catch (error) {
      console.error('File Upload Error:', error);
      throw error;
    }
  }

  // File POST method
  static async filePost(
    url: string,
    file: File,
    fieldName?: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.apiFileRequest('POST', url, file, fieldName, headers);
  }

  // Audio file specific upload
  static async audioPost(
    url: string,
    file: File,
    headers?: Record<string, string>
  ): Promise<ApiResponse> {
    return this.filePost(url, file, 'audio', headers);
  }
}

export { BASE_URL };