/**
 * CSRF PROTECTION
 * ==============
 * 
 * Cross-Site Request Forgery protection utilities
 */

import { generateSecureToken } from './security';

class CSRFProtection {
  private token: string | null = null;
  private readonly tokenKey = 'nyumbalink_csrf_token';
  
  // Generate and store CSRF token
  generateToken(): string {
    this.token = generateSecureToken(32);
    
    // Store in sessionStorage (more secure than localStorage for CSRF tokens)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(this.tokenKey, this.token);
    }
    
    return this.token;
  }
  
  // Get current CSRF token
  getToken(): string | null {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      this.token = sessionStorage.getItem(this.tokenKey);
    }
    
    return this.token;
  }
  
  // Validate CSRF token
  validateToken(providedToken: string): boolean {
    const storedToken = this.getToken();
    
    if (!storedToken || !providedToken) {
      return false;
    }
    
    // Use constant-time comparison to prevent timing attacks
    return this.constantTimeEqual(storedToken, providedToken);
  }
  
  // Constant-time string comparison
  private constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
  
  // Clear CSRF token
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
    }
  }
  
  // Add CSRF token to request headers
  addTokenToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getToken();
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }
}

export const csrfProtection = new CSRFProtection();

// Initialize CSRF token on app start
if (typeof window !== 'undefined') {
  csrfProtection.generateToken();
}

// Request validation utilities
export const requestValidation = {
  // Validate request origin
  validateOrigin: (origin: string): boolean => {
    const allowedOrigins = [
      'http://localhost:8080',
      'https://nyumba-link.com',
      'https://www.nyumba-link.com'
    ];
    
    return allowedOrigins.includes(origin);
  },
  
  // Validate request method
  validateMethod: (method: string, allowedMethods: string[]): boolean => {
    return allowedMethods.includes(method.toUpperCase());
  },
  
  // Validate content type
  validateContentType: (contentType: string, allowedTypes: string[]): boolean => {
    return allowedTypes.some(type => contentType.includes(type));
  },
  
  // Create secure request options
  createSecureRequest: (options: RequestInit = {}): RequestInit => {
    const headers = new Headers(options.headers);
    
    // Add CSRF token
    const csrfToken = csrfProtection.getToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    
    // Add security headers
    headers.set('X-Requested-With', 'XMLHttpRequest');
    
    return {
      ...options,
      headers,
      credentials: 'same-origin', // Include cookies for same-origin requests
    };
  }
};