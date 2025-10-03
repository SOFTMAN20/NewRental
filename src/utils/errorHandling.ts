/**
 * SECURE ERROR HANDLING
 * ====================
 * 
 * Utilities for secure error handling and error masking
 * to prevent information disclosure
 */

// Error types that should be masked in production
const SENSITIVE_ERROR_PATTERNS = [
  /database/i,
  /sql/i,
  /connection/i,
  /timeout/i,
  /internal server/i,
  /stack trace/i,
  /file not found/i,
  /permission denied/i,
  /access denied/i,
  /unauthorized/i,
  /authentication failed/i,
  /invalid token/i,
  /jwt/i,
  /session/i
];

// Generic error messages for different categories
const GENERIC_ERROR_MESSAGES = {
  auth: 'Authentication failed. Please check your credentials.',
  validation: 'Invalid input provided. Please check your data.',
  network: 'Network error. Please check your connection.',
  server: 'Server error. Please try again later.',
  permission: 'You do not have permission to perform this action.',
  notFound: 'The requested resource was not found.',
  rateLimit: 'Too many requests. Please try again later.',
  generic: 'An unexpected error occurred. Please try again.'
};

export class SecureErrorHandler {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  
  // Mask sensitive error information
  static maskError(error: any): string {
    if (!error) return GENERIC_ERROR_MESSAGES.generic;
    
    const errorMessage = typeof error === 'string' ? error : error.message || error.toString();
    
    // In development, show actual errors for debugging
    if (this.isDevelopment) {
      return errorMessage;
    }
    
    // In production, mask sensitive errors
    const isSensitive = SENSITIVE_ERROR_PATTERNS.some(pattern => 
      pattern.test(errorMessage)
    );
    
    if (isSensitive) {
      return this.categorizeError(errorMessage);
    }
    
    return errorMessage;
  }
  
  // Categorize errors and return appropriate generic message
  private static categorizeError(errorMessage: string): string {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('auth') || message.includes('login') || message.includes('password')) {
      return GENERIC_ERROR_MESSAGES.auth;
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return GENERIC_ERROR_MESSAGES.validation;
    }
    
    if (message.includes('network') || message.includes('connection') || message.includes('timeout')) {
      return GENERIC_ERROR_MESSAGES.network;
    }
    
    if (message.includes('permission') || message.includes('access') || message.includes('forbidden')) {
      return GENERIC_ERROR_MESSAGES.permission;
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return GENERIC_ERROR_MESSAGES.notFound;
    }
    
    if (message.includes('rate') || message.includes('limit') || message.includes('too many')) {
      return GENERIC_ERROR_MESSAGES.rateLimit;
    }
    
    return GENERIC_ERROR_MESSAGES.server;
  }
  
  // Log errors securely (without sensitive information in production)
  static logError(error: any, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorId = this.generateErrorId();
    
    if (this.isDevelopment) {
      console.group(`🚨 Error ${errorId} - ${timestamp}`);
      if (context) console.log('Context:', context);
      console.error('Error:', error);
      console.groupEnd();
    } else {
      // In production, log minimal information
      console.error(`Error ${errorId}:`, this.maskError(error));
    }
    
    // Here you could send errors to a logging service
    // this.sendToLoggingService(errorId, error, context);
  }
  
  // Generate unique error ID for tracking
  private static generateErrorId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  // Create user-friendly error object
  static createUserError(error: any, context?: string): {
    message: string;
    id: string;
    timestamp: string;
  } {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();
    
    this.logError(error, context);
    
    return {
      message: this.maskError(error),
      id: errorId,
      timestamp
    };
  }
}

// Wrapper for async operations with error handling
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: any }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    const userError = SecureErrorHandler.createUserError(error, context);
    return { error: userError };
  }
};

// React error boundary helper
export const handleReactError = (error: Error, errorInfo: any): void => {
  SecureErrorHandler.logError(error, `React Error Boundary: ${errorInfo.componentStack}`);
};

// Network request error handler
export const handleNetworkError = (error: any, url?: string): string => {
  const context = url ? `Network request to ${url}` : 'Network request';
  const userError = SecureErrorHandler.createUserError(error, context);
  return userError.message;
};