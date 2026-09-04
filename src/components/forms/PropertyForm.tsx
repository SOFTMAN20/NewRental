/**
 * PROPERTYFORM.TSX - ENHANCED INTERACTIVE PROPERTY FORM
 * ====================================================
 * 
 * Enhanced property form component
 * 
 * ENHANCED FEATURES:
 * - Multi-step wizard with progress indicator
 * - Interactive animations and transitions
 * - Enhanced visual feedback and validation
 * - Smart form sections with icons
 * - Beautiful UI with gradients and shadows
 * - Real-time preview and feedback
 */

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/forms/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, Save, RefreshCw, Home, MapPin, Phone, Camera, 
  Building, Bed, Bath, Ruler, Zap, Droplets, Car, 
  Shield, Sofa, ChevronRight, ChevronLeft, CheckCircle,
  Star, Info, Heart, Users, Award, Briefcase,
  Wifi, Utensils, BookOpen, Volume2, Waves, Laptop
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';
import { validateInput, rateLimiters } from '@/utils/security';

type Property = Tables<'properties'>;
type Profile = Tables<'profiles'>;

/**
 * PROPERTY FORM DATA INTERFACE
 * ===========================
 * 
 * Defines the structure for property form data.
 */
interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  full_address: string;
  property_type: string;
  available_beds: string;
  gender_restrictions: string;
  university_id: string;
  distance_from_campus: string;
  amenities: any;
  bedrooms: string;
  bathrooms: string;
  area_sqm: string;
  contact_phone: string;
  contact_whatsapp_phone: string;
  electricity: boolean;
  water: boolean;
  furnished: boolean;
  parking: boolean;
  security: boolean;
  nearby_services: string[];
  images: string[];
  contract_months: string;
}

interface PropertyFormProps {
  isOpen: boolean;
  editingProperty: Property | null;
  formData: PropertyFormData;
  profile: Profile | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof PropertyFormData, value: any) => void;
  onServiceToggle: (service: string) => void;
}

/**
 * ENHANCED PROPERTY FORM COMPONENT
 * ===============================
 * 
 * Interactive multi-step form with beautiful UI and animations.
 * Features progress tracking, validation feedback, and enhanced UX.
 * 
 * Fomu ya mwingiliano ya hatua nyingi na UI nzuri na michoro.
 * Inajumuisha ufuatiliaji wa maendeleo, majibu ya uthibitisho, na UX iliyoboreshwa.
 */
const PropertyForm: React.FC<PropertyFormProps> = ({
  isOpen,
  editingProperty,
  formData,
  profile,
  submitting,
  onClose,
  onSubmit,
  onInputChange,
  onServiceToggle
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);

  // Form persistence constants
  const FORM_STORAGE_KEY = 'wanachuo_property_form_data';
  const STEP_STORAGE_KEY = 'wanachuo_property_form_step';

  // Load saved form data and step from localStorage on component mount
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only restore data for new properties, not when editing existing ones
      try {
        const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
        const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
        
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData);
          // Restore form data by calling onInputChange for each field
          Object.keys(parsedData).forEach((key) => {
            if (parsedData[key] !== undefined && parsedData[key] !== null) {
              onInputChange(key as keyof PropertyFormData, parsedData[key]);
            }
          });
        }
        
        if (savedStep) {
          const stepNumber = parseInt(savedStep, 10);
          if (stepNumber >= 1 && stepNumber <= 4) {
            setCurrentStep(stepNumber);
          }
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        // Clear corrupted data
        localStorage.removeItem(FORM_STORAGE_KEY);
        localStorage.removeItem(STEP_STORAGE_KEY);
      }
    }
  }, [isOpen, editingProperty]);

  // Save form data to localStorage whenever formData changes
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only save data for new properties, not when editing existing ones
      try {
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  }, [formData, isOpen, editingProperty]);

  // Save current step to localStorage whenever step changes
  useEffect(() => {
    if (isOpen && !editingProperty) {
      // Only save step for new properties, not when editing existing ones
      try {
        localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
      } catch (error) {
        console.error('Error saving form step:', error);
      }
    }
  }, [currentStep, isOpen, editingProperty]);

  // Clear saved data when form is successfully submitted or closed
  const clearSavedData = () => {
    try {
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };
  
  // PropertyForm component rendered
  const totalSteps = 4;

  if (!isOpen) return null;

  // Calculate form completion progress
  const calculateProgress = () => {
    let completedFields = 0;
    const totalFields = 7;
    
    if (formData.title) completedFields++;
    if (formData.price) completedFields++;
    if (formData.location) completedFields++;
    if (formData.description) completedFields++;
    if (formData.contact_phone) completedFields++;
    if (formData.property_type) completedFields++;
    if (formData.images.length > 0) completedFields++;
    
    return (completedFields / totalFields) * 100;
  };

  const progress = calculateProgress();

  // Step validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.images && formData.images.length > 0; // Photos - at least 1 required
      case 2:
        return !!(formData.title?.trim() && formData.price?.trim() && formData.location?.trim());
      case 3:
        return !!(formData.description?.trim() && formData.property_type?.trim());
      case 4:
        return !!formData.contact_phone?.trim();
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Photos', icon: Camera, description: 'Property photos (at least 1 required)' },
    { id: 2, title: 'Basic Info', icon: Home, description: 'Title, price and location' },
    { id: 3, title: 'Property Details', icon: Building, description: 'Room type and amenities' },
    { id: 4, title: 'Contact', icon: Phone, description: 'Phone numbers' }
  ];

  /**
   * STEP 1: BASIC INFORMATION
   * ========================
   * 
   * Enhanced basic information step with icons and validation feedback.
   */
  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header with icon */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Home className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Basic Information</h3>
        <p className="text-gray-600">Fill in essential details about your property</p>
      </div>

      {/* Property Name */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2 text-sm font-medium">
          <Building className="h-4 w-4 text-primary" />
          {t('dashboard.propertyName')} *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder={t('dashboard.propertyNameExample')}
          className={`transition-all duration-200 ${formData.title ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.title && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Sawa! Jina limejazwa
          </div>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="flex items-center gap-2 text-sm font-medium">
          <Star className="h-4 w-4 text-primary" />
          {t('dashboard.rentPrice')} *
        </Label>
        <div className="relative">
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="800000"
            className={`pl-12 transition-all duration-200 ${formData.price ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
            TZS
          </div>
        </div>
        {formData.price && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Bei: TZS {parseInt(formData.price || '0').toLocaleString()}/mwezi
          </div>
        )}
      </div>

      {/* Contract Months */}
      <div className="space-y-2">
        <Label htmlFor="contract_months" className="flex items-center gap-2 text-sm font-medium">
          <Briefcase className="h-4 w-4 text-primary" />
          Mkataba wa Miezi (Contract Period)
        </Label>
        <Select 
          value={formData.contract_months || '3'} 
          onValueChange={(value) => onInputChange('contract_months', value)}
        >
          <SelectTrigger className={`transition-all duration-200 ${formData.contract_months ? 'border-green-300 bg-green-50' : ''}`}>
            <SelectValue placeholder="Chagua idadi ya miezi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Mwezi 1 (1 Month)</SelectItem>
            <SelectItem value="2">Miezi 2 (2 Months)</SelectItem>
            <SelectItem value="3">Miezi 3 (3 Months) - Kawaida</SelectItem>
            <SelectItem value="4">Miezi 4 (4 Months)</SelectItem>
            <SelectItem value="5">Miezi 5 (5 Months)</SelectItem>
            <SelectItem value="6">Miezi 6 (6 Months)</SelectItem>
            <SelectItem value="12">Mwaka 1 (12 Months)</SelectItem>
          </SelectContent>
        </Select>
        {formData.contract_months && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Mkataba: Miezi {formData.contract_months}
          </div>
        )}
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          {t('dashboard.area')} *
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder={t('dashboard.areaExample')}
          className={`transition-all duration-200 ${formData.location ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        {formData.location && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <CheckCircle className="h-3 w-3" />
            Eneo limejazwa
          </div>
        )}
      </div>

      {/* Progress indicator for this step */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 1: Maelezo ya Msingi</span>
          <Badge variant={isStepValid(1) ? "default" : "secondary"} className="ml-2">
            {isStepValid(1) ? "Kamili" : "Inahitajika"}
          </Badge>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 2: PROPERTY DETAILS
   * =======================
   * 
   * Enhanced property details step with interactive elements.
   */
  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-serengeti-500 to-kilimanjaro-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Property Details</h3>
        <p className="text-gray-600">Describe your property in detail</p>
      </div>

      {/* Property Type - Student Housing Focus */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4 text-primary" />
          Aina ya Chumba *
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'single_room', label: 'Chumba Kimoja (Single Room)', icon: Bed, desc: 'Chumba moja kwa mwanafunzi mmoja' },
            { value: 'shared_room', label: 'Chumba cha Pamoja (Shared)', icon: Users, desc: 'Wanafunzi wawili au zaidi' },
            { value: 'master_room', label: 'Master Room', icon: Award, desc: 'Main room with private bathroom' },
            { value: 'self_contained', label: 'Self Contained', icon: Home, desc: 'Room with bathroom and toilet inside' },
            { value: 'apartment', label: 'Apartment/Flat', icon: Building, desc: 'Multi-room property' },
            { value: 'studio', label: 'Studio/Bedsitter', icon: Home, desc: 'Room with kitchenette and bathroom' },
            { value: 'dormitory', label: 'Dormitory', icon: Building, desc: 'Multiple rooms for hostel' }
          ].map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => onInputChange('property_type', value)}
              className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                formData.property_type === value 
                  ? 'border-primary bg-primary/5 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 mt-0.5 ${formData.property_type === value ? 'text-primary' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <span className={`font-medium block ${formData.property_type === value ? 'text-primary' : 'text-gray-700'}`}>
                    {label}
                  </span>
                  <span className="text-xs text-gray-500 block mt-1">{desc}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Student-Specific Details */}
      <div className="space-y-4">
        {/* Gender Restrictions */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4 text-primary" />
            Wanafunzi Wanaoruhusiwa
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'male_only', label: 'Wavulana Tu', emoji: '👨‍🎓' },
              { value: 'female_only', label: 'Wasichana Tu', emoji: '👩‍🎓' },
              { value: 'mixed', label: 'Wote', emoji: '👥' }
            ].map(({ value, label, emoji }) => (
              <button
                key={value}
                type="button"
                onClick={() => onInputChange('gender_restrictions', value)}
                className={`p-3 border-2 rounded-lg transition-all duration-200 ${
                  formData.gender_restrictions === value 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{emoji}</div>
                <div className={`text-sm font-medium ${formData.gender_restrictions === value ? 'text-primary' : 'text-gray-700'}`}>
                  {label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Available Beds */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Bed className="h-4 w-4 text-primary" />
            Idadi ya Vitanda Vilivyopo
          </Label>
          <Input
            type="number"
            value={formData.available_beds}
            onChange={(e) => onInputChange('available_beds', e.target.value)}
            placeholder="1"
            className="text-center text-lg"
            min="1"
          />
          <p className="text-xs text-gray-500">Kitanda kimoja = mwanafunzi mmoja</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
          <Info className="h-4 w-4 text-primary" />
          {t('dashboard.description')} *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('dashboard.describeProperty')}
          rows={6}
          className={`transition-all duration-200 border-2 border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 ${formData.description ? 'border-green-400 bg-green-50' : 'hover:border-gray-400'}`}
          required
        />
        <div className="text-xs text-gray-500 text-right">
          {formData.description.length}/500 herufi
        </div>
      </div>

      {/* Student Housing Amenities - Simplified */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Award className="h-4 w-4 text-primary" />
          Huduma Zilizopo (Amenities)
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'WiFi', label: 'WiFi/Internet', icon: Wifi, desc: 'Mtandao wa haraka', color: 'text-blue-600' },
            { key: '24_Hour_Security', label: 'Ulinzi 24/7', icon: Shield, desc: 'Askari na kamera', color: 'text-green-600' },
            { key: 'Meal_Plan', label: 'Chakula', icon: Utensils, desc: 'Mipango ya chakula', color: 'text-orange-600' },
            { key: 'Study_Room', label: 'Chumba cha Kusoma', icon: BookOpen, desc: 'Nafasi ya kusomea', color: 'text-purple-600' },
            { key: 'Quiet_Hours', label: 'Wakati wa Utulivu', icon: Volume2, desc: 'Masaa ya kimya', color: 'text-gray-600' },
            { key: 'Backup_Generator', label: 'Jenereta', icon: Zap, desc: 'Umeme wa ziada', color: 'text-yellow-600' },
            { key: 'Laundry_Facilities', label: 'Mashine ya Kufulia', icon: Waves, desc: 'Huduma ya dobi', color: 'text-cyan-600' },
            { key: 'Study_Desk_In_Room', label: 'Meza ya Kusomea', icon: Laptop, desc: 'Meza na kiti', color: 'text-indigo-600' }
          ].map(({ key, label, icon: Icon, desc, color }) => {
            const isSelected = formData.amenities?.[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  const newAmenities = { ...formData.amenities, [key]: !isSelected };
                  onInputChange('amenities', newAmenities);
                }}
                className={`p-4 border-2 rounded-lg transition-all duration-200 text-left hover:shadow-md ${
                  isSelected ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? color : 'text-gray-400'}`} />
                    <div>
                      <span className={`font-medium block ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                        {label}
                      </span>
                      <span className="text-xs text-gray-500 block mt-0.5">{desc}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* University and Distance */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Building className="h-4 w-4 text-primary" />
            Chuo Kikuu Kilichokaribu
          </Label>
          <Select 
            value={formData.university_id} 
            onValueChange={(value) => onInputChange('university_id', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chagua chuo kikuu..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="9c0445e4-5492-46ad-87d8-7aa19564a0d1">UDSM - University of Dar es Salaam</SelectItem>
              <SelectItem value="3a66a06e-0dde-402c-9c85-69c992085f39">DIT - Dar es Salaam Institute of Technology</SelectItem>
              <SelectItem value="4f57b203-d56d-4f7d-8685-79c5752ae658">OUT - Open University of Tanzania</SelectItem>
              <SelectItem value="993c5329-9588-4d10-ba81-c0bfde085940">ARU - Ardhi University</SelectItem>
              <SelectItem value="6321d492-87f2-49a3-899f-73380410366c">UDOM - University of Dodoma</SelectItem>
              <SelectItem value="68794951-3342-4633-9970-ae19cbea45c7">SUA - Sokoine University</SelectItem>
              <SelectItem value="4b003b77-b817-4371-bb2e-e3efc2f035f4">MUHAS - Muhimbili University</SelectItem>
              <SelectItem value="3fb45e07-d761-48c6-851c-61058ae42c17">MU - Mzumbe University</SelectItem>
              <SelectItem value="369442a2-5421-4eb3-add0-e5677f541ebe">IFM - Institute of Finance Management</SelectItem>
              <SelectItem value="b9fd4ef3-343c-4035-b3a7-13b6d085823c">MUST - Mbeya University</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary" />
            Muda kutoka Chuo (dakika)
          </Label>
          <Input
            type="number"
            step="1"
            value={formData.distance_from_campus}
            onChange={(e) => onInputChange('distance_from_campus', e.target.value)}
            placeholder="15"
            className="text-center text-lg"
          />
          <p className="text-xs text-gray-500">Mfano: 0.5 km = 500 mita</p>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step 2: Property Details</span>
          <Badge variant={isStepValid(2) ? "default" : "secondary"}>
            {isStepValid(2) ? "Complete" : "Required"}
          </Badge>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 3: CONTACT INFORMATION
   * ==========================
   * 
   * Enhanced contact information step with validation.
   */
  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-kilimanjaro-500 to-safari-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Maelezo ya Mawasiliano *</h3>
        <p className="text-gray-600">Weka namba ya simu ili wapangaji waweze kuwasiliana nawe</p>
      </div>

      {/* Contact Phone */}
      <div className="space-y-2">
        <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm font-medium">
          <Phone className="h-4 w-4 text-primary" />
          {t('dashboard.contactPhone')} *
        </Label>
        <Input
          id="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={(e) => onInputChange('contact_phone', e.target.value)}
          placeholder="+255712345678"
          className={`transition-all duration-200 ${formData.contact_phone ? 'border-green-300 bg-green-50' : ''}`}
          required
        />
        <p className="text-xs text-gray-500">
          {t('dashboard.contactPhoneDescription')}
        </p>
      </div>

      {/* WhatsApp Phone */}
      <div className="space-y-2">
        <Label htmlFor="contact_whatsapp_phone" className="flex items-center gap-2 text-sm font-medium">
          <Heart className="h-4 w-4 text-green-500" />
          {t('dashboard.whatsappNumber')}
          <Badge variant="secondary" className="ml-2 text-xs">Si lazima</Badge>
        </Label>
        <Input
          id="contact_whatsapp_phone"
          type="tel"
          value={formData.contact_whatsapp_phone}
          onChange={(e) => onInputChange('contact_whatsapp_phone', e.target.value)}
          placeholder="+255712345678"
          className={`transition-all duration-200 ${formData.contact_whatsapp_phone ? 'border-green-300 bg-green-50' : ''}`}
        />
        <p className="text-xs text-gray-500">
          {t('dashboard.whatsappOptional')}
        </p>
      </div>



      {/* Full Address (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="full_address" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" />
          Anwani Kamili
          <Badge variant="secondary" className="ml-2 text-xs">Si lazima</Badge>
        </Label>
        <Input
          id="full_address"
          value={formData.full_address}
          onChange={(e) => onInputChange('full_address', e.target.value)}
          placeholder="Mfano: Barabara ya Uhuru, Jengo la ABC, Ghorofa ya 3"
          className="transition-all duration-200"
        />
        <p className="text-xs text-gray-500">
          Weka anwani kamili ili kuwa rahisi kwa wapangaji kukupata
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 4: Maelezo ya Mawasiliano</span>
          <div className="flex items-center gap-2">
            <Badge variant={isStepValid(4) ? "default" : "destructive"}>
              {isStepValid(4) ? "Kamili ✓" : "Namba ya simu inahitajika"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * STEP 4: PHOTO UPLOAD
   * ===================
   * 
   * Enhanced photo upload step with preview.
   */
  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-safari-500 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Picha za Nyumba *</h3>
        <p className="text-gray-600">Ongeza picha nzuri za nyumba yako ili kuvutia wapangaji</p>
      </div>

      {/* Photo Upload Component */}
      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) => onInputChange('images', images)}
        />
      </div>

      {/* Progress indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua ya 1: Picha za Nyumba</span>
          <div className="flex items-center gap-2">
            <Badge variant={formData.images.length > 0 ? "default" : "destructive"}>
              {formData.images.length} picha
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * STEP NAVIGATION COMPONENT - MOBILE RESPONSIVE
   * ============================================
   * 
   * Renders interactive step navigation with progress indicators.
   * Optimized for mobile with smaller sizes and proper spacing.
   */
  const renderStepNavigation = () => (
    <div className="mb-6 sm:mb-8">
      {/* Mobile step indicator - HIDDEN */}
      <div className="hidden">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hatua {currentStep} ya {totalSteps}</span>
          <span>{Math.round(progress)}% kamili</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </div>
      
      {/* Desktop step navigation */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep || (step.id <= currentStep && isStepValid(step.id));
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg scale-110' 
                    : isCompleted 
                    ? 'bg-green-500 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {isCompleted && step.id < currentStep ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
              </button>
              
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-2 transition-colors duration-200 ${
                  step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  /**
   * STEP CONTENT RENDERER
   * ====================
   * 
   * Renders the current step content with smooth transitions.
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep4(); // Photos - Step 1
      case 2:
        return renderStep1(); // Basic Info - Step 2
      case 3:
        return renderStep2(); // Property Details - Step 3
      case 4:
        return renderStep3(); // Contact - Step 4
      default:
        return renderStep4(); // Photos as default
    }
  };

    /**
   * FORM NAVIGATION BUTTONS
   * ======================
   * 
   * Enhanced navigation buttons with step validation.
   */
  const renderNavigationButtons = () => {
    // Handle form submission for the last step
    const handleSubmitClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      console.log('Submit button clicked, current step:', currentStep, 'total steps:', totalSteps);
      
      if (currentStep === totalSteps) {
        console.log('Attempting to submit form with data:', formData);
        
        // Validate all required fields before submission
        const requiredFieldsValid = !!(
          formData.title?.trim() && 
          formData.price?.trim() && 
          formData.location?.trim() && 
          formData.description?.trim() && 
          formData.contact_phone?.trim() &&
          formData.property_type?.trim() &&
          formData.images && formData.images.length > 0
        );
        
        console.log('Validation check:', {
          title: !!formData.title?.trim(),
          price: !!formData.price?.trim(),
          location: !!formData.location?.trim(),
          description: !!formData.description?.trim(),
          contact_phone: !!formData.contact_phone?.trim(),
          property_type: !!formData.property_type?.trim(),
          images: formData.images && formData.images.length > 0,
          imagesLength: formData.images?.length || 0
        });
        
        if (!requiredFieldsValid) {
          console.error('Required fields missing:', {
            title: !!formData.title?.trim(),
            price: !!formData.price?.trim(),
            location: !!formData.location?.trim(),
            description: !!formData.description?.trim(),
            contact_phone: !!formData.contact_phone?.trim(),
            property_type: !!formData.property_type?.trim(),
            images: formData.images && formData.images.length > 0
          });
          
          // Show alert to user about missing fields
          alert('Please fill in all required fields before adding property:\n\n' +
            `• Property title: ${formData.title?.trim() ? '✓' : '✗'}\n` +
            `• Rental price: ${formData.price?.trim() ? '✓' : '✗'}\n` +
            `• Location: ${formData.location?.trim() ? '✓' : '✗'}\n` +
            `• Property description: ${formData.description?.trim() ? '✓' : '✗'}\n` +
            `• Property type: ${formData.property_type?.trim() ? '✓' : '✗'}\n` +
            `• Phone number: ${formData.contact_phone?.trim() ? '✓' : '✗'}\n` +
            `• Property photos: ${formData.images && formData.images.length > 0 ? '✓' : '✗'} (${formData.images?.length || 0} photos)`
          );
          return;
        }
        
        console.log('All validations passed, calling onSubmit...');
        
        // Create a synthetic form event and call onSubmit
        const syntheticEvent = {
          preventDefault: () => {},
          currentTarget: null
        } as React.FormEvent;
        
        try {
          console.log('Calling onSubmit function...');
          await onSubmit(syntheticEvent);
          console.log('Form submitted successfully');
          // Clear saved data after successful submission
          clearSavedData();
        } catch (error) {
          console.error('Form submission error:', error);
          alert('There was a problem adding the property. Please try again.');
        }
      } else {
        console.log('Not on final step, cannot submit yet');
      }
    };

    return (
      <>
        {/* Buttons Layout - Separated */}
        <div className="flex justify-between items-center gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={currentStep === 1 ? () => { clearSavedData(); onClose(); } : prevStep}
              disabled={submitting}
              className="flex items-center justify-center gap-2 min-h-[44px] px-6"
            >
              {currentStep === 1 ? (
                <>
                  <X className="h-4 w-4" />
                  <span className="hidden xs:inline sm:inline">{t('dashboard.cancel')}</span>
                  <span className="inline xs:hidden sm:hidden">Funga</span>
                </>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden xs:inline sm:inline">Rudi Nyuma</span>
                  <span className="inline xs:hidden sm:hidden">Rudi</span>
                </>
              )}
            </Button>

            {/* Next/Submit button - Mobile */}
            {currentStep < totalSteps ? (
              <Button 
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center justify-center gap-2 min-h-[44px] px-6"
              >
                <span>Endelea</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmitClick}
                className="bg-gradient-to-r from-primary to-serengeti-500 hover:from-primary/90 hover:to-serengeti-400 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 min-h-[44px] px-6"
                disabled={submitting || !isStepValid(currentStep)}
                title={`Submit button - Current step: ${currentStep}, Total steps: ${totalSteps}, Submitting: ${submitting}, Valid: ${isStepValid(currentStep)}`}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="hidden xs:inline sm:inline">{editingProperty ? t('dashboard.updating') : t('dashboard.adding')}</span>
                    <span className="inline xs:hidden sm:hidden">{editingProperty ? 'Sasisha' : 'Ongeza'}</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="hidden xs:inline sm:inline">{editingProperty ? 'Update Property' : 'Add Property'}</span>
                    <span className="inline xs:hidden sm:hidden">{editingProperty ? 'Update' : 'Add'}</span>
                  </>
                )}
              </Button>
            )}
          </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-white sm:bg-black/60 sm:backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-4 z-[150]">
      <Card className="w-full h-full sm:h-[98vh] sm:max-w-[98vw] sm:w-[98vw] lg:max-w-[96vw] xl:max-w-[94vw] overflow-hidden shadow-none sm:shadow-2xl border-0 rounded-none sm:rounded-lg relative flex flex-col">
        {/* Enhanced Header */}
        <CardHeader className="bg-gradient-to-r from-primary/10 to-serengeti-50 border-b">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-600 bg-clip-text text-transparent line-clamp-1">
              {editingProperty ? t('dashboard.updateProperty') : t('dashboard.addNewPropertyTitle')}
            </CardTitle>
              <p className="hidden sm:block text-gray-600 mt-1 text-sm sm:text-base line-clamp-2">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => { clearSavedData(); onClose(); }}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center">
          {/* Centered Content Container */}
          <div className="w-full max-w-3xl mx-auto">
            {/* Step Navigation */}
            {renderStepNavigation()}
            
            {/* Current Step Content */}
            <div className="min-h-[400px]">
              {renderCurrentStep()}
            </div>
          </div>
        </CardContent>

        {/* Fixed Footer with Navigation Buttons */}
        <div className="border-t bg-white">
          <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
            {renderNavigationButtons()}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PropertyForm;