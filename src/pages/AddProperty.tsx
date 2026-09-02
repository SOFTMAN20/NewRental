/**
 * ADD PROPERTY PAGE
 * =================
 * 
 * Dedicated page for landlords to add new properties to the platform.
 * Provides a clean, focused environment for property creation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import PropertyForm from '@/components/forms/PropertyForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/lib/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  property_type: string;
  available_beds: string;
  gender_restrictions: string;
  university_id: string;
  distance_from_campus: string;
  amenities: any;
  images: string[];
  nearby_services: string[];
  full_address: string;
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
  contract_months: string;
}

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    property_type: '',
    available_beds: '1',
    gender_restrictions: 'mixed',
    university_id: '',
    distance_from_campus: '',
    amenities: {},
    images: [],
    nearby_services: [],
    full_address: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    contact_phone: '',
    contact_whatsapp_phone: '',
    electricity: false,
    water: false,
    furnished: false,
    parking: false,
    security: false,
    contract_months: '3'
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
      // Pre-fill contact phone from profile if available
      if (data.phone) {
        setFormData(prev => ({
          ...prev,
          contact_phone: data.phone || '',
          contact_whatsapp_phone: data.phone || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field: keyof PropertyFormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string): void => {
    setFormData(prev => ({
      ...prev,
      nearby_services: prev.nearby_services.includes(service)
        ? prev.nearby_services.filter(s => s !== service)
        : [...prev.nearby_services, service]
    }));
  };

  const validateFormData = () => {
    const errors: string[] = [];
    
    if (!formData.title?.trim() || formData.title.trim().length < 5) {
      errors.push('Jina la nyumba lazima liwe na angalau herufi 5');
    }
    if (!formData.description?.trim() || formData.description.trim().length < 10) {
      errors.push('Maelezo ya nyumba lazima yawe na angalau herufi 10');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('Bei ya nyumba lazima iwe zaidi ya 0');
    }
    if (!formData.location?.trim() || formData.location.trim().length < 2) {
      errors.push('Eneo la nyumba lazima liwe na angalau herufi 2');
    }
    if (!formData.property_type?.trim()) {
      errors.push('Chagua aina ya chumba');
    }
    if (!formData.images || formData.images.length === 0) {
      errors.push('Ongeza angalau picha moja ya nyumba');
    }

    const allowedTypes = [
      'single_room', 'shared_room', 'master_room', 
      'self_contained', 'apartment', 'studio', 'dormitory'
    ];
    if (formData.property_type && !allowedTypes.includes(formData.property_type)) {
      errors.push('Aina ya chumba si sahihi. Chagua aina sahihi');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const isValidUUID = (str: string | null | undefined): boolean => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Kosa",
        description: "Lazima uingie kwanza kabla ya kuongeza nyumba",
        variant: "destructive"
      });
      navigate('/signin');
      return;
    }

    try {
      setSubmitting(true);
      
      // Verify user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast({
          title: "Kosa",
          description: "Hujaingia kikamilifu. Tafadhali ingia tena.",
          variant: "destructive"
        });
        return;
      }
      
      // Validate form data
      const validationResult = validateFormData();
      if (!validationResult.isValid) {
        toast({
          title: "Kosa",
          description: validationResult.errors[0] || 'Tafadhali jaza taarifa zote za lazima',
          variant: "destructive"
        });
        return;
      }
      
      // Validate and clean university_id
      const cleanUniversityId = formData.university_id && isValidUUID(formData.university_id) 
        ? formData.university_id 
        : null;
      
      // Build property data for student housing schema
      const propertyData = {
        landlord_id: user.id,
        title: formData.title?.trim(),
        description: formData.description?.trim() || '',
        monthly_rent: parseFloat(formData.price) || 0,
        address: formData.location?.trim(),
        city: formData.location?.trim()?.split(',')[1]?.trim() || formData.location?.trim(),
        region: 'Dar es Salaam',
        room_type: formData.property_type || 'single_room',
        bed_count: formData.available_beds ? parseInt(formData.available_beds) : 1,
        available_beds: formData.available_beds ? parseInt(formData.available_beds) : 1,
        gender_restrictions: formData.gender_restrictions || 'mixed',
        university_id: cleanUniversityId,
        distance_from_campus: formData.distance_from_campus ? parseFloat(formData.distance_from_campus) : null,
        amenities: formData.amenities || {},
        images: formData.images || [],
        contact_phone: formData.contact_phone?.trim() || null,
        contact_whatsapp_phone: formData.contact_whatsapp_phone?.trim() || null,
        full_address: formData.full_address?.trim() || null,
        contract_months: formData.contract_months ? parseInt(formData.contract_months) : 3,
        status: 'active'
      };
      
      // Create authenticated client
      const { createClient } = await import('@supabase/supabase-js');
      const authenticatedClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      );
      
      const { data, error } = await authenticatedClient
        .from('properties')
        .insert([propertyData])
        .select();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Hitilafu ya database: ${error.message}`);
      }
      
      toast({
        title: "Hongera!",
        description: "Nyumba yako imeongezwa kikamilifu",
      });
      
      // Clear saved form data
      try {
        localStorage.removeItem('nyumba_link_property_form_data');
        localStorage.removeItem('nyumba_link_property_form_step');
      } catch (error) {
        console.error('Error clearing saved form data:', error);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error saving property:', error);
      
      let errorMessage = 'Imeshindikana kuongeza nyumba yako. Jaribu tena.';
      
      if (error instanceof Error) {
        if (error.message.includes('JWT') || error.message.includes('session')) {
          errorMessage = 'Hujaingia kikamilifu. Tafadhali ingia tena.';
        } else if (error.message.includes('database')) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Kosa",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Lazima uingie kwanza</h2>
          <p className="text-gray-600 mb-4">Ingia ili kuongeza nyumba</p>
          <Button onClick={() => navigate('/signin')}>
            Ingia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Rudi Dashibodi
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ongeza Nyumba Mpya
            </h1>
            <p className="text-gray-600">
              Jaza fomu hii ili kuongeza nyumba yako kwenye mfumo
            </p>
          </div>
        </div>

        {/* Property Form */}
        <div className="bg-white rounded-lg shadow-sm">
          <PropertyForm
            isOpen={true}
            editingProperty={null}
            formData={formData}
            profile={profile}
            submitting={submitting}
            onClose={() => navigate('/dashboard')}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onServiceToggle={handleServiceToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
