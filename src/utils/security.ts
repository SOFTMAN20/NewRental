/**
 * SECURITY UTILITIES
 * =================
 * 
 * Comprehensive security utilities for XSS protection,
 * input validation, and data sanitization
 */

// XSS Protection utilities
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous HTML attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick, onload, etc.
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, ''); // javascript: protocol
  sanitized = sanitized.replace(/\s*data\s*:/gi, ''); // data: protocol
  sanitized = sanitized.replace(/\s*vbscript\s*:/gi, ''); // vbscript: protocol
  
  // Remove potentially dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  return sanitized.trim();
};

// Escape HTML entities
export const escapeHtml = (text: string): string => {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Validate and sanitize user input
export const validateInput = {
  // Email validation
  email: (email: string): { isValid: boolean; sanitized: string; error?: string } => {
    const sanitized = sanitizeHtml(email.trim().toLowerCase());
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, sanitized, error: 'Invalid email format' };
    }
    
    if (sanitized.length > 254) {
      return { isValid: false, sanitized, error: 'Email too long' };
    }
    
    return { isValid: true, sanitized };
  },

  // Phone number validation
  phone: (phone: string): { isValid: boolean; sanitized: string; error?: string } => {
    const sanitized = sanitizeHtml(phone.trim());
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    
    if (!phoneRegex.test(sanitized.replace(/[\s\-\(\)]/g, ''))) {
      return { isValid: false, sanitized, error: 'Invalid phone number format' };
    }
    
    return { isValid: true, sanitized };
  },

  // Text input validation (for titles, descriptions, etc.)
  text: (text: string, maxLength: number = 1000): { isValid: boolean; sanitized: string; error?: string } => {
    const sanitized = sanitizeHtml(text.trim());
    
    if (sanitized.length === 0) {
      return { isValid: false, sanitized, error: 'Text cannot be empty' };
    }
    
    if (sanitized.length > maxLength) {
      return { isValid: false, sanitized, error: `Text too long (max ${maxLength} characters)` };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:text\/html/i,
      /vbscript:/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(text))) {
      return { isValid: false, sanitized, error: 'Invalid content detected' };
    }
    
    return { isValid: true, sanitized };
  },

  // Price validation
  price: (price: string): { isValid: boolean; sanitized: number; error?: string } => {
    const sanitized = sanitizeHtml(price.trim());
    const numericPrice = parseFloat(sanitized);
    
    if (isNaN(numericPrice) || numericPrice < 0) {
      return { isValid: false, sanitized: 0, error: 'Invalid price format' };
    }
    
    if (numericPrice > 999999999) {
      return { isValid: false, sanitized: 0, error: 'Price too high' };
    }
    
    return { isValid: true, sanitized: numericPrice };
  },

  // URL validation
  url: (url: string): { isValid: boolean; sanitized: string; error?: string } => {
    const sanitized = sanitizeHtml(url.trim());
    
    try {
      const urlObj = new URL(sanitized);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, sanitized, error: 'Invalid URL protocol' };
      }
      
      return { isValid: true, sanitized: urlObj.toString() };
    } catch {
      return { isValid: false, sanitized, error: 'Invalid URL format' };
    }
  }
};

// Content Security Policy helpers
export const cspHelpers = {
  // Generate nonce for inline scripts
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  // Validate external URLs against whitelist
  isAllowedDomain: (url: string): boolean => {
    const allowedDomains = [
      'supabase.co',
      'unsplash.com',
      'images.unsplash.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];
    
    try {
      const urlObj = new URL(url);
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }
};

// Rate limiting utilities
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingAttempts(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - record.count);
  }
  
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Create rate limiters for different operations
export const rateLimiters = {
  login: new RateLimiter(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  signup: new RateLimiter(3, 60 * 60 * 1000), // 3 attempts per hour
  propertyCreation: new RateLimiter(10, 60 * 60 * 1000), // 10 properties per hour
  imageUpload: new RateLimiter(20, 60 * 60 * 1000), // 20 images per hour
};

// Secure token generation
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Password strength validation
export const validatePassword = (password: string): { 
  isValid: boolean; 
  score: number; 
  feedback: string[] 
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain lowercase letters');
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain uppercase letters');
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Password must contain numbers');
  } else {
    score += 1;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain special characters');
  } else {
    score += 1;
  }
  
  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    feedback.push('Password contains common patterns');
    score = Math.max(0, score - 2);
  }
  
  return {
    isValid: score >= 4 && feedback.length === 0,
    score,
    feedback
  };
};