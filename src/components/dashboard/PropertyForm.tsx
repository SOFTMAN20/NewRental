/**
 * PROPERTYFORM.TSX - PROPERTY FORM COMPONENT
 * ==========================================
 * 
 * Kipengele cha fomu ya nyumba - Property form component
 * 
 * FUNCTIONALITY / KAZI:
 * - Handles property creation and editing (Kushughulikia kutengeneza na kuhariri nyumba)
 * - Manages form state and validation (Kusimamia hali ya fomu na uthibitisho)
 * - Provides image upload functionality (Kutoa utendakazi wa kupakia picha)
 * - Handles form submission and API calls (Kushughulikia uwasilishaji wa fomu na simu za API)
 * 
 * FEATURES / VIPENGELE:
 * - Comprehensive property form fields (Uga kamili wa fomu ya nyumba)
 * - Image upload with preview (Kupakia picha na muhtasari)
 * - Form validation and error handling (Uthibitisho wa fomu na kushughulikia makosa)
 * - Responsive design for all devices (Muundo unaojibu kwa vifaa vyote)
 */

import React from 'react';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/integrations/supabase/types';

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
 * PROPERTY FORM COMPONENT
 * ======================
 * 
 * Modal form component for creating and editing properties.
 * Handles all form interactions and validation.
 * 
 * Kipengele cha fomu ya modal kwa kutengeneza na kuhariri nyumba.
 * Kinashughulikia mwingiliano wote wa fomu na uthibitisho.
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

  if (!isOpen) return null;

  /**
   * BASIC INFORMATION FIELDS
   * =======================
   * 
   * Renders the basic property information form fields.
   */
  const renderBasicInformationFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">{t('dashboard.propertyName')} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => onInputChange('title', e.target.value)}
          placeholder={t('dashboard.propertyNameExample')}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">{t('dashboard.rentPrice')} *</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => onInputChange('price', e.target.value)}
          placeholder="800000"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">{t('dashboard.area')} *</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => onInputChange('location', e.target.value)}
          placeholder={t('dashboard.areaExample')}
          required
        />
      </div>

      <div>
        <Label htmlFor="property_type">{t('dashboard.propertyType')}</Label>
        <Select value={formData.property_type} onValueChange={(value) => onInputChange('property_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('dashboard.selectPropertyType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartment">{t('dashboard.apartment')}</SelectItem>
            <SelectItem value="house">{t('dashboard.house')}</SelectItem>
            <SelectItem value="room">{t('dashboard.room')}</SelectItem>
            <SelectItem value="studio">{t('dashboard.studio')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="bedrooms">{t('dashboard.bedrooms')}</Label>
          <Input
            id="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={(e) => onInputChange('bedrooms', e.target.value)}
            placeholder="2"
          />
        </div>
        <div>
          <Label htmlFor="bathrooms">{t('dashboard.bathrooms')}</Label>
          <Input
            id="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={(e) => onInputChange('bathrooms', e.target.value)}
            placeholder="1"
          />
        </div>
      </div>
    </div>
  );

  /**
   * DESCRIPTION AND FEATURES FIELDS
   * ==============================
   * 
   * Renders description and property features form fields.
   */
  const renderDescriptionAndFeaturesFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="description">{t('dashboard.description')} *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('dashboard.describeProperty')}
          rows={4}
          required
        />
      </div>

      <div>
        <Label>{t('dashboard.basicServices')}</Label>
        <div className="space-y-3 mt-2">
          {[
            { key: 'electricity', label: t('dashboard.electricity') },
            { key: 'water', label: t('dashboard.water') },
            { key: 'furnished', label: t('dashboard.furniture') },
            { key: 'parking', label: t('dashboard.parking') },
            { key: 'security', label: t('dashboard.security') }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span>{label}</span>
              <Switch
                checked={formData[key as keyof PropertyFormData] as boolean}
                onCheckedChange={(checked) => onInputChange(key as keyof PropertyFormData, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('dashboard.nearbyServices')}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['school', 'hospital', 'market', 'bank', 'transport'].map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.nearby_services.includes(service)}
                onChange={() => onServiceToggle(service)}
              />
              <span className="text-sm">
                {service === 'school' ? t('dashboard.school') :
                 service === 'hospital' ? t('dashboard.hospital') :
                 service === 'market' ? t('dashboard.market') :
                 service === 'bank' ? t('dashboard.bank') : t('dashboard.transport')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  /**
   * CONTACT INFORMATION FIELDS
   * =========================
   * 
   * Renders contact information form fields.
   */
  const renderContactInformationFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contact_phone">{t('dashboard.contactPhone')} *</Label>
        <Input
          id="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={(e) => onInputChange('contact_phone', e.target.value)}
          placeholder="+255712345678"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('dashboard.contactPhoneDescription')}
        </p>
      </div>

      <div>
        <Label htmlFor="contact_whatsapp_phone">{t('dashboard.whatsappNumber')}</Label>
        <Input
          id="contact_whatsapp_phone"
          type="tel"
          value={formData.contact_whatsapp_phone}
          onChange={(e) => onInputChange('contact_whatsapp_phone', e.target.value)}
          placeholder="+255712345678"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('dashboard.whatsappOptional')}
        </p>
      </div>
    </div>
  );

  /**
   * FORM ACTION BUTTONS
   * ==================
   * 
   * Renders the form submission and cancel buttons.
   */
  const renderFormActions = () => (
    <div className="flex justify-end space-x-4 pt-6 border-t">
      <Button 
        type="button" 
        variant="outline"
        onClick={onClose}
        disabled={submitting}
      >
        {t('dashboard.cancel')}
      </Button>
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary/90"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            {editingProperty ? t('dashboard.updating') : t('dashboard.adding')}
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            {editingProperty ? t('dashboard.updatePropertyAction') : t('dashboard.addPropertyAction')}
          </>
        )}
      </Button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {editingProperty ? t('dashboard.updateProperty') : t('dashboard.addNewPropertyTitle')}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderBasicInformationFields()}
              {renderDescriptionAndFeaturesFields()}
            </div>
            {renderContactInformationFields()}
            <div className="border-t pt-6">
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => onInputChange('images', images)}
              />
            </div>
            {renderFormActions()}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyForm;