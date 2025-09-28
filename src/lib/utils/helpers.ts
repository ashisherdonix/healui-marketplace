import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Cookie management following clinic-web pattern
export const getCookieValue = (name: string): string | undefined => {
  const value = getCookie(name);
  return value ? String(value) : undefined;
};

export const setTokenCookie = (name: string, value: string) => {
  setCookie(name, value, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
};

export const removeTokenCookie = (name: string) => {
  deleteCookie(name, {
    path: '/',
  });
};

// Auth token helpers
export const setAuthTokens = (accessToken: string, refreshToken?: string) => {
  setTokenCookie('access_token', accessToken);
  if (refreshToken) {
    setTokenCookie('refresh_token', refreshToken);
  }
};

export const removeAuthTokens = () => {
  removeTokenCookie('access_token');
  removeTokenCookie('refresh_token');
};

export const getAccessToken = (): string | undefined => {
  return getCookieValue('access_token');
};

export const getRefreshToken = (): string | undefined => {
  return getCookieValue('refresh_token');
};

// Date formatting helpers
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().split('T')[0];
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};

// URL helpers
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      searchParams.append(key, params[key].toString());
    }
  });
  return searchParams.toString();
};

// Error handling helpers
export const handleApiError = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Storage helpers for client-side data
export const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = (key: string): any => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const removeLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

// Debounce helper for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};