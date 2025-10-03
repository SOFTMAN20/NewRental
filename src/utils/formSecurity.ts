/**
 * FORM SECURITY MIDDLEWARE
 * =======================
 * 
 * Security middleware for form submissions
 */

import { validateInput, rateLimiters } from './security';
import { csrfProtection } from './csrf';
import { SecureErrorHandler } from './errorHandling';

export interface SecureFormData {
  [key: string]: any;
}

export interface ValidationResult {
  isValid: boolean;
  sanitizedData: SecureFormData;
  errors: Record<string, string>;
}

export class FormSecurityMiddleware {
  // Validate property form data
  static validatePropertyForm(formData: any, userId: string): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: SecureFormData = {};

    // Rate limiting check
    if (!rateLimiters.propertyCreation.isAllowed(userId)) {
      errors.general = 'Too many property submissions. Please try again later.';
      return { isValid: false, sanitizedData, errors };
    }

    // Validate title
    const titleValidation = validateInput.text(formData.title, 200);
    if (!titleValidation.isValid) {
      errors.title = titleValidation.error || 'Invalid title';
    } else {
      sanitizedData.title = titleValidation.sanitized;
    }

    // Validate description
    const descriptionValidation = validateInput.text(formData.description, 2000);
    if (!descriptionValidation.isValid) {
      errors.description = descriptionValidation.error || 'Invalid description';
    } else {
      sanitizedData.description = descriptionValidation.sanitized;
    }

    // Validate price
    const priceValidation = validateInput.price(formData.price);
    if (!priceValidation.isValid) {
      errors.price = priceValidation.error || 'Invalid price';
    } else {
      sanitizedData.price = priceValidation.sanitized;
    }

    // Validate location
    const locationValidation = validateInput.text(formData.location, 100);
    if (!locationValidation.isValid) {
      errors.location = locationValidation.error || 'Invalid location';
    } else {
      sanitizedData.location = locationValidation.sanitized;
    }

    // Validate contact phone
    if (formData.contact_phone) {
      const phoneValidation = validateInput.phone(formData.contact_phone);
      if (!phoneValidation.isValid) {
        errors.contact_phone = phoneValidation.error || 'Invalid phone number';
      } else {
        sanitizedData.contact_phone = phoneValidation.sanitized;
      }
    }

    // Validate WhatsApp phone
    if (formData.contact_whatsapp_phone) {
      const whatsappValidation = validateInput.phone(formData.contact_whatsapp_phone);
      if (!whatsappValidation.isValid) {
        errors.contact_whatsapp_phone = whatsappValidation.error || 'Invalid WhatsApp number';
      } else {
        sanitizedData.contact_whatsapp_phone = whatsappValidation.sanitized;
      }
    }

    // Validate property type
    const allowedPropertyTypes = ['apartment', 'house', 'room', 'studio', 'office'];
    if (formData.property_type && !allowedPropertyTypes.includes(formData.property_type)) {
      errors.property_type = 'Invalid property type';
    } else {
      sanitizedData.property_type = formData.property_type;
    }

    // Validate numeric fields
    const numericFields = ['bedrooms', 'bathrooms', 'area_sqm'];
    numericFields.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== '') {
        const value = parseInt(formData[field]);
        if (isNaN(value) || value < 0 || value > 1000) {
          errors[field] = `Invalid ${field} value`;
        } else {
          sanitizedData[field] = value;
        }
      }
    });

    // Validate boolean fields
    const booleanFields = ['electricity', 'water', 'furnished', 'parking', 'security'];
    booleanFields.forEach(field => {
      sanitizedData[field] = Boolean(formData[field]);
    });

    // Validate nearby services
    if (formData.nearby_services && Array.isArray(formData.nearby_services)) {
      const allowedServices = ['school', 'hospital', 'market', 'bank', 'transport'];
      const validServices = formData.nearby_services.filter((service: string) => 
        allowedServices.includes(service)
      );
      sanitizedData.nearby_services = validServices;
    } else {
      sanitizedData.nearby_services = [];
    }

    // Validate images array
    if (formData.images && Array.isArray(formData.images)) {
      const validImages = formData.images.filter((url: string) => {
        try {
          new URL(url);
          return url.includes('supabase.co/storage') || url.includes('unsplash.com');
        } catch {
          return false;
        }
      });
      sanitizedData.images = validImages.slice(0, 10); // Max 10 images
    } else {
      sanitizedData.images = [];
    }

    // Add required fields
    sanitizedData.landlord_id = userId;
    sanitizedData.status = 'active';

    return {
      isValid: Object.keys(errors).length === 0,
      sanitizedData,
      errors
    };
  }

  // Validate profile form data
  static validateProfileForm(formData: any, userId: string): ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: SecureFormData = {};

    // Validate full name
    const nameValidation = validateInput.text(formData.full_name, 100);
    if (!nameValidation.isValid) {
      errors.full_name = nameValidation.error || 'Invalid name';
    } else {
      sanitizedData.full_name = nameValidation.sanitized;
    }

    // Validate phone
    if (formData.phone) {
      const phoneValidation = validateInput.phone(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error || 'Invalid phone number';
      } else {
        sanitizedData.phone = phoneValidation.sanitized;
      }
    }

    // Validate user type
    if (!['landlord', 'tenant'].includes(formData.user_type)) {
      errors.user_type = 'Invalid user type';
    } else {
      sanitizedData.user_type = formData.user_type;
    }

    sanitizedData.user_id = userId;

    return {
      isValid: Object.keys(errors).length === 0,
      sanitizedData,
      errors
    };
  }
}