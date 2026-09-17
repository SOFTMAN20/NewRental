/**
 * SECURITY UTILITIES - ULINZI WA USALAMA
 * ======================================
 * 
 * Comprehensive security functions to prevent:
 * - XSS (Cross-Site Scripting)
 * - SQL Injection
 * - CSRF (Cross-Site Request Forgery)
 * - Code Injection
 * - Open Redirects
 * - Clickjacking
 * 
 * Vitendaji vya usalama kuzuia:
 * - Mashambulizi ya XSS
 * - SQL Injection
 * - CSRF attacks
 * - Kuingiza code mbaya
 * - Redirects zenye hatari
 */

/**
 * SANITIZE USER INPUT
 * ===================
 * Removes potentially dangerous characters from user input
 * Ondoa herufi zenye hatari kutoka kwa input ya mtumiaji
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    // Remove HTML tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    // Remove javascript: and data: protocols
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '');
};

/**
 * SANITIZE HTML
 * =============
 * More aggressive HTML sanitization
 * Usafishaji mkali wa HTML
 */
export const sanitizeHTML = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = html; // This escapes ALL HTML
  return div.innerHTML;
};

/**
 * VALIDATE URL
 * ============
 * Ensures URL is safe and not malicious
 * Hakikisha URL ni salama na si mbaya
 */
export const validateURL = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedURL = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      console.warn('🚨 Blocked dangerous URL protocol:', parsedURL.protocol);
      return false;
    }
    
    // Block known dangerous patterns
    const dangerous = [
      'javascript:',
      'data:',
      'vbscript:',
      'file:',
      'about:',
    ];
    
    if (dangerous.some(pattern => url.toLowerCase().includes(pattern))) {
      console.warn('🚨 Blocked dangerous URL pattern:', url);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('🚨 Invalid URL:', url);
    return false;
  }
};

/**
 * SAFE REDIRECT
 * =============
 * Only allows redirects to same origin or whitelisted domains
 * Ruhusu redirects kwa domain zilizoidhinishwa tu
 */
export const safeRedirect = (url: string): void => {
  if (!validateURL(url)) {
    console.error('🚨 SECURITY: Blocked unsafe redirect to:', url);
    window.location.href = '/';
    return;
  }
  
  try {
    const targetURL = new URL(url, window.location.origin);
    const currentOrigin = window.location.origin;
    
    // Whitelist of allowed domains for redirect
    const allowedDomains = [
      currentOrigin,
      'https://wanachuo.com',
      'https://www.wanachuo.com',
    ];
    
    const targetOrigin = targetURL.origin;
    
    if (!allowedDomains.includes(targetOrigin)) {
      console.warn('🚨 SECURITY: Blocked redirect to external domain:', targetOrigin);
      window.location.href = '/';
      return;
    }
    
    window.location.href = targetURL.href;
  } catch (error) {
    console.error('🚨 SECURITY: Error in safeRedirect:', error);
    window.location.href = '/';
  }
};

/**
 * VALIDATE EMAIL
 * ==============
 * Validates email format and prevents injection
 * Thibitisha format ya email na zuia injection
 */
export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // Check basic format
  if (!emailRegex.test(email)) return false;
  
  // Check for dangerous characters
  const dangerous = ['<', '>', '"', "'", '\\', ';', '(', ')', '{', '}', '[', ']'];
  if (dangerous.some(char => email.includes(char))) {
    console.warn('🚨 Email contains dangerous characters:', email);
    return false;
  }
  
  return true;
};

/**
 * VALIDATE PHONE NUMBER
 * =====================
 * Validates phone number format for Tanzania
 * Thibitisha namba ya simu ya Tanzania
 */
export const validatePhone = (phone: string): boolean => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove spaces and dashes
  const cleaned = phone.replace(/[\s-]/g, '');
  
  // Tanzania phone formats:
  // +255XXXXXXXXX (13 chars)
  // 0XXXXXXXXX (10 chars)
  // 255XXXXXXXXX (12 chars)
  const tanzaniaRegex = /^(\+?255|0)[67]\d{8}$/;
  
  if (!tanzaniaRegex.test(cleaned)) {
    console.warn('🚨 Invalid Tanzania phone number:', phone);
    return false;
  }
  
  return true;
};

/**
 * ESCAPE SQL SPECIAL CHARACTERS
 * ==============================
 * Prevents SQL injection (though Supabase handles this)
 * Zuia SQL injection
 */
export const escapeSQLString = (str: string): string => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .replace(/'/g, "''")  // Escape single quotes
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/\0/g, '\\0')  // Escape null bytes
    .replace(/\n/g, '\\n')  // Escape newlines
    .replace(/\r/g, '\\r')  // Escape carriage returns
    .replace(/\x1a/g, '\\Z'); // Escape Ctrl-Z
};

/**
 * GENERATE CSRF TOKEN
 * ===================
 * Creates unique token for form submissions
 * Tengeneza token ya kipekee kwa fomu
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * STORE CSRF TOKEN
 * ================
 * Safely stores CSRF token
 * Hifadhi token ya CSRF kwa usalama
 */
export const storeCSRFToken = (): string => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

/**
 * VALIDATE CSRF TOKEN
 * ===================
 * Verifies CSRF token matches
 * Thibitisha token ya CSRF inafanana
 */
export const validateCSRFToken = (token: string): boolean => {
  const stored = sessionStorage.getItem('csrf_token');
  return stored === token;
};

/**
 * RATE LIMITING
 * =============
 * Prevents brute force and spam attacks
 * Zuia mashambulizi ya brute force
 */
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export const checkRateLimit = (
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);
  
  if (!entry) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstAttempt: now,
    });
    return true;
  }
  
  // Check if window has expired
  if (now - entry.firstAttempt > windowMs) {
    rateLimitStore.set(identifier, {
      count: 1,
      firstAttempt: now,
    });
    return true;
  }
  
  // Check if limit exceeded
  if (entry.count >= maxAttempts) {
    console.warn('🚨 SECURITY: Rate limit exceeded for:', identifier);
    return false;
  }
  
  // Increment count
  entry.count++;
  return true;
};

/**
 * SANITIZE FILE NAME
 * ==================
 * Prevents directory traversal attacks
 * Zuia mashambulizi ya directory traversal
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') return '';
  
  return fileName
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*\x00-\x1F]/g, '') // Remove invalid characters
    .replace(/^\./, '') // Remove leading dot
    .trim();
};

/**
 * VALIDATE FILE TYPE
 * ==================
 * Ensures only allowed file types are uploaded
 * Hakikisha file types zilizoruhusiwa tu zinapakiwa
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  if (!file || !file.type) {
    console.warn('🚨 Invalid file object');
    return false;
  }
  
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Check MIME type
  if (!allowedTypes.some(type => fileType.includes(type))) {
    console.warn('🚨 SECURITY: Blocked file type:', fileType);
    return false;
  }
  
  // Double-check extension
  const dangerousExtensions = [
    '.exe', '.bat', '.cmd', '.sh', '.php', '.asp', '.aspx',
    '.jsp', '.js', '.jar', '.app', '.deb', '.rpm', '.dmg',
    '.scr', '.vbs', '.dll', '.sys'
  ];
  
  if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
    console.warn('🚨 SECURITY: Blocked dangerous file extension:', fileName);
    return false;
  }
  
  return true;
};

/**
 * CONTENT SECURITY POLICY NONCE
 * ==============================
 * Generates nonce for inline scripts
 * Tengeneza nonce kwa scripts za inline
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * CHECK FOR XSS PATTERNS
 * ======================
 * Detects common XSS attack patterns
 * Gundua patterns za mashambulizi ya XSS
 */
export const detectXSS = (input: string): boolean => {
  if (!input || typeof input !== 'string') return false;
  
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];
  
  const hasXSS = xssPatterns.some(pattern => pattern.test(input));
  
  if (hasXSS) {
    console.error('🚨 XSS ATTACK DETECTED:', input.substring(0, 50));
  }
  
  return hasXSS;
};

/**
 * SAFE LOCAL STORAGE
 * ==================
 * Safely stores and retrieves from localStorage
 * Hifadhi na pata data kutoka localStorage kwa usalama
 */
export const safeLocalStorage = {
  set: (key: string, value: any): boolean => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
      localStorage.setItem(sanitizedKey, JSON.stringify(sanitizedValue));
      return true;
    } catch (error) {
      console.error('🚨 Error storing to localStorage:', error);
      return false;
    }
  },
  
  get: (key: string): any => {
    try {
      const sanitizedKey = sanitizeInput(key);
      const item = localStorage.getItem(sanitizedKey);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('🚨 Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      const sanitizedKey = sanitizeInput(key);
      localStorage.removeItem(sanitizedKey);
    } catch (error) {
      console.error('🚨 Error removing from localStorage:', error);
    }
  }
};

/**
 * LOG SECURITY EVENT
 * ==================
 * Logs security-related events for monitoring
 * Rekodi matukio ya usalama kwa ufuatiliaji
 */
export const logSecurityEvent = (
  eventType: string,
  details: any,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void => {
  const event = {
    type: eventType,
    severity,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    details,
  };
  
  console.warn(`🚨 SECURITY EVENT [${severity.toUpperCase()}]:`, event);
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production' && severity === 'critical') {
    // TODO: Send to security monitoring service
    // Example: sendToSentry(event);
  }
};

export default {
  sanitizeInput,
  sanitizeHTML,
  validateURL,
  safeRedirect,
  validateEmail,
  validatePhone,
  escapeSQLString,
  generateCSRFToken,
  storeCSRFToken,
  validateCSRFToken,
  checkRateLimit,
  sanitizeFileName,
  validateFileType,
  generateNonce,
  detectXSS,
  safeLocalStorage,
  logSecurityEvent,
};
