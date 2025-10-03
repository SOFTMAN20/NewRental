/**
 * DASHBOARD.TSX - MAIN DASHBOARD ORCHESTRATOR
 * ==========================================
 * 
 * Dashibodi kuu ya usimamizi - Main dashboard orchestrator
 * 
 * REFACTORED ARCHITECTURE / MUUNDO ULIOBORESHWA:
 * This file now serves as the main orchestrator for the dashboard,
 * delegating specific responsibilities to smaller, focused components.
 * 
 * COMPONENT BREAKDOWN / MGAWANYIKO WA VIPENGELE:
 * - DashboardHeader: Welcome banner and user info
 * - QuickActions: Action buttons for common tasks
 * - StatsSection: Performance metrics and statistics
 * - PropertyManagement: Property listing and management
 * - PropertyForm: Property creation and editing modal
 * - ProfileSettings: User profile editing modal
 * - GetHelpSection: Help and support modal
 * 
 * BENEFITS OF REFACTORING / FAIDA ZA KUBORESHWA:
 * - Improved maintainability (Uboreshaji wa udumishaji)
 * - Better code organization (Mpangilio bora wa msimbo)
 * - Easier testing (Upimaji rahisi)
 * - Enhanced reusability (Uongezaji wa matumizi tena)
 * - Clearer separation of concerns (Mgawanyiko wazi wa majukumu)
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import DashboardHeader from '@/components/layout/DashboardHeader';
import QuickActions from '@/components/common/QuickActions';
import StatsSection from '@/components/common/StatsSection';
import PropertyManagement from '@/components/common/PropertyManagement';
import PropertyForm from '@/components/forms/PropertyForm';
import ProfileSettings from '@/components/forms/ProfileSettings';
import GetHelpSection from '@/components/common/GetHelpSection';

import { RefreshCw } from 'lucide-react';
import { PropertyGridSkeleton } from '@/components/common/PropertyCardSkeleton';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';

// Type definitions for better type safety
type Property = Tables<'properties'>;
type Profile = Tables<'profiles'>;

/**
 * FORM DATA INTERFACES
 * ===================
 * 
 * Centralized type definitions for form data structures.
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

interface ProfileFormData {
  full_name: string;
  phone: string;
  user_type: string;
}

/**
 * UI STATE INTERFACE
 * =================
 * 
 * Centralized UI state management interface.
 */
interface UIState {
  showAddForm: boolean;
  showProfileDialog: boolean;
  showHelpDialog: boolean;
  loading: boolean;
  submitting: boolean;
  profileLoading: boolean;
  isNewUser: boolean;
  searchQuery: string;
  filterStatus: string;
  viewMode: 'grid' | 'list';
}

/**
 * DASHBOARD COMPONENT - REFACTORED ORCHESTRATOR
 * ============================================
 * 
 * Main dashboard component that orchestrates all dashboard functionality
 * through smaller, focused child components.
 * 
 * Kipengele kikuu cha dashibodi kinachosimamia utendakazi wote wa dashibodi
 * kupitia vipengele vidogo vilivyolenga.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // Centralized UI state management
  const [uiState, setUIState] = useState<UIState>({
    showAddForm: false,
    showProfileDialog: false,
    showHelpDialog: false,
    loading: true,
    submitting: false,
    profileLoading: false,
    isNewUser: false,
    searchQuery: '',
    filterStatus: 'all',
    viewMode: 'grid'
  });
  
  // Data state management
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  
  // Form state management
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    full_name: '',
    phone: '',
    user_type: 'landlord'
  });
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: '',
    location: '',
    full_address: '',
    property_type: '',
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
    nearby_services: [],
    images: []
  });

  /**
   * INITIALIZATION AND LIFECYCLE MANAGEMENT
   * =======================================
   */
  useEffect(() => {
    if (user) {
      initializeDashboard();
    }
  }, [user]);

  const initializeDashboard = async (): Promise<void> => {
    try {
      // Try to fetch profile and properties, but don't fail completely if profile fetch fails
      const results = await Promise.allSettled([
        fetchProfile(),
        fetchProperties()
      ]);
      
      // Log any failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const operation = index === 0 ? 'fetchProfile' : 'fetchProperties';
          console.warn(`${operation} failed:`, result.reason);
        }
      });
      
      checkIfNewUser();
    } catch (error) {
      console.error('Dashboard initialization failed:', error);
      showErrorToast('Imeshindikana kupakia dashibodi');
    }
  };

  const checkIfNewUser = (): void => {
    if (!user) return;
    
    const userCreatedAt = new Date(user.created_at);
    const now = new Date();
    const timeDiff = now.getTime() - userCreatedAt.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff < 5) {
      updateUIState({ isNewUser: true });
    }
  };

  /**
   * PROFILE MANAGEMENT FUNCTIONS
   * ===========================
   */
  const fetchProfile = async (): Promise<void> => {
    if (!user) {
      console.error('No user found when trying to fetch profile');
      return;
    }

    console.log('Fetching profile for user:', user.id);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('Profile fetch result:', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('Profile data found:', data);
        setProfile(data);
        setProfileForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          user_type: data.user_type || 'landlord'
        });
      } else {
        console.log('No profile data found, creating basic profile for user');
        // Create a basic profile for the user
        await createBasicProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showErrorToast('Imeshindikana kupata maelezo ya akaunti yako');
    }
  };

  const createBasicProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      console.log('Creating basic profile for user:', user.id);
      const basicProfileData = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mtumiaji',
        phone: '',
        user_type: 'landlord'
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([basicProfileData])
        .select()
        .single();

      if (error) {
        console.error('Error creating basic profile:', error);
        // If profile creation fails, set default form data
        setProfileForm({
          full_name: basicProfileData.full_name,
          phone: '',
          user_type: 'landlord'
        });
      } else {
        console.log('Basic profile created successfully:', data);
        setProfile(data);
        setProfileForm({
          full_name: data.full_name || '',
          phone: data.phone || '',
          user_type: data.user_type || 'landlord'
        });
      }
    } catch (error) {
      console.error('Error in createBasicProfile:', error);
      // Fallback to default form data
      setProfileForm({
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Mtumiaji',
        phone: '',
        user_type: 'landlord'
      });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!user) return;

    try {
      updateUIState({ profileLoading: true });
      
      const profileData = {
        user_id: user.id,
        full_name: profileForm.full_name,
        phone: profileForm.phone,
        user_type: profileForm.user_type
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      showSuccessToast('Maelezo ya akaunti yako yamebadilishwa kikamilifu');
      updateUIState({ showProfileDialog: false });
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      showErrorToast('Imeshindikana kubadilisha maelezo ya akaunti yako');
    } finally {
      updateUIState({ profileLoading: false });
    }
  };

  /**
   * PROPERTY MANAGEMENT FUNCTIONS
   * ============================
   */
  const fetchProperties = async (): Promise<void> => {
    if (!user) return;

    try {
      updateUIState({ loading: true });
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      showErrorToast('Imeshindikana kupata nyumba zako');
    } finally {
      updateUIState({ loading: false });
    }
  };

  const handlePropertySubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    console.log('handlePropertySubmit called');
    
    if (!user) {
      console.error('No user found when trying to submit property');
      showErrorToast('Lazima uingie kwanza kabla ya kuongeza nyumba');
      return;
    }

    try {
      console.log('Starting property submission...');
      updateUIState({ submitting: true });
      
      // Verify user session before proceeding
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error('Session error:', sessionError);
        showErrorToast('Hujaingia kikamilifu. Tafadhali ingia tena.');
        return;
      }
      
      console.log('User session verified:', session.user.id);
      console.log('Session access token exists:', !!session.access_token);
      console.log('User ID matches form data landlord_id:', session.user.id === user.id);
      
      // Validate form data before submission
      const validationResult = validateFormData();
      console.log('Form validation result:', validationResult);
      
      if (!validationResult.isValid) {
        console.error('Form validation failed:', validationResult.errors);
        showErrorToast(validationResult.errors[0] || 'Tafadhali jaza taarifa zote za lazima');
        return;
      }
      
      console.log('Form validation passed successfully');
      
      const propertyData = buildPropertyData();
      console.log('Property data built:', propertyData);
      
      if (editingProperty) {
        console.log('Updating existing property...');
        await updateExistingProperty(propertyData);
      } else {
        console.log('Creating new property...');
        await createNewProperty(propertyData);
      }

      console.log('Property saved successfully, closing form...');
      
      // Clear saved form data on successful submission
      try {
        localStorage.removeItem('nyumba_link_property_form_data');
        localStorage.removeItem('nyumba_link_property_form_step');
      } catch (error) {
        console.error('Error clearing saved form data:', error);
      }
      
      handleCloseForm();
      await fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      
      // Log detailed error information for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Imeshindikana kuongeza nyumba yako. Jaribu tena.';
      
      if (error instanceof Error) {
        console.log('Analyzing error message:', error.message);
        
        if (error.message.includes('JWT') || error.message.includes('session')) {
          errorMessage = 'Hujaingia kikamilifu. Tafadhali ingia tena.';
        } else if (error.message.includes('validation') || error.message.includes('violates')) {
          errorMessage = 'Taarifa ulizojaza hazikidhi mahitaji. Jaribu tena.';
        } else if (error.message.includes('permission') || error.message.includes('ruhusa')) {
          errorMessage = 'Huna ruhusa ya kuongeza nyumba. Hakikisha umeingia kama mwenye nyumba.';
        } else if (error.message.includes('row-level security')) {
          errorMessage = 'Hitilafu ya usalama. Hakikisha umejaza taarifa zote za lazima.';
        } else if (error.message.includes('database')) {
          errorMessage = error.message; // Show the specific database error
        }
      }
      
      console.log('Final error message to show user:', errorMessage);
      showErrorToast(errorMessage);
    } finally {
      console.log('Property submission process completed');
      updateUIState({ submitting: false });
    }
  };

  const validateFormData = () => {
    const errors: string[] = [];
    
    console.log('Validating form data:', {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      location: formData.location,
      contact_phone: formData.contact_phone,
      property_type: formData.property_type,
      images_count: formData.images?.length || 0
    });
    
    // Required field validation
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
    if (!formData.contact_phone?.trim() || formData.contact_phone.trim().length < 10) {
      errors.push('Nambari ya simu lazima iwe na angalau nambari 10');
    }
    
    // Property type is optional for database but let's make it required for better UX
    if (!formData.property_type?.trim()) {
      errors.push('Chagua aina ya nyumba (apartment, house, room, studio, au office)');
    }
    
    if (!formData.images || formData.images.length === 0) {
      errors.push('Ongeza angalau picha moja ya nyumba');
    }
    
    // Length validation
    if (formData.title && formData.title.length > 200) {
      errors.push('Jina la nyumba lisilozidi herufi 200');
    }
    if (formData.description && formData.description.length > 2000) {
      errors.push('Maelezo ya nyumba yasilozidi herufi 2000');
    }
    if (formData.location && formData.location.length > 100) {
      errors.push('Eneo la nyumba lisilozidi herufi 100');
    }
    if (formData.contact_phone && formData.contact_phone.length > 20) {
      errors.push('Nambari ya simu isilozidi nambari 20');
    }
    
    // Price validation
    const price = parseFloat(formData.price || '0');
    if (price >= 999999999) {
      errors.push('Bei ya nyumba ni kubwa sana');
    }
    
    // Property type validation
    const allowedTypes = ['apartment', 'house', 'room', 'studio', 'office'];
    if (formData.property_type && !allowedTypes.includes(formData.property_type)) {
      errors.push('Aina ya nyumba si sahihi');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const buildPropertyData = () => {
    console.log('Building property data with formData:', formData);
    
    const propertyData = {
      landlord_id: user!.id,
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      price: parseFloat(formData.price) || 0,
      location: formData.location?.trim(),
      full_address: formData.full_address?.trim() || null,
      property_type: formData.property_type?.trim() || null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
      contact_phone: formData.contact_phone?.trim() || null,
      contact_whatsapp_phone: formData.contact_whatsapp_phone?.trim() || null,
      electricity: !!formData.electricity,
      water: !!formData.water,
      furnished: !!formData.furnished,
      parking: !!formData.parking,
      security: !!formData.security,
      nearby_services: formData.nearby_services || [],
      images: formData.images || []
    };
    
    console.log('Built property data:', propertyData);
    
    // Validate the built data against RLS policy requirements
    console.log('Validating built data:');
    console.log('- Title length:', propertyData.title?.length, '(required: 5-200)');
    console.log('- Description length:', propertyData.description?.length, '(required: 10-2000)');
    console.log('- Price:', propertyData.price, '(required: > 0 and < 999999999)');
    console.log('- Location length:', propertyData.location?.length, '(required: 2-100)');
    console.log('- Contact phone length:', propertyData.contact_phone?.length, '(required: 10-20)');
    console.log('- Property type:', propertyData.property_type, '(allowed: apartment, house, room, studio, office)');
    console.log('- Landlord ID:', propertyData.landlord_id);
    
    return propertyData;
  };

  const updateExistingProperty = async (propertyData: any): Promise<void> => {
    console.log('Updating property with ID:', editingProperty?.id);
    
    // Ensure we have a fresh session and create authenticated client
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session found');
    }
    
    // Create a new supabase client with the current session
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
      .update(propertyData)
      .eq('id', editingProperty!.id)
      .select();

    console.log('Update result:', { data, error });
    if (error) {
      console.error('Update error:', error);
      
      // Enhanced error handling
      if (error.message.includes('new row violates row-level security policy')) {
        throw new Error('Huna ruhusa ya kusasisha nyumba hii.');
      } else {
        throw new Error(`Hitilafu ya database: ${error.message}`);
      }
    }
    
    showSuccessToast('Nyumba yako imesasishwa kikamilifu');
  };

  const createNewProperty = async (propertyData: any): Promise<void> => {
    console.log('Creating new property...');
    
    // Ensure we have a fresh session and create authenticated client
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session found');
    }
    
    console.log('Using session for user:', session.user.id);
    console.log('Property data landlord_id:', propertyData.landlord_id);
    
    // Detailed validation logging before sending to database
    console.log('=== DETAILED PROPERTY DATA VALIDATION ===');
    console.log('Title:', propertyData.title, '(length:', propertyData.title?.length, ')');
    console.log('Description:', propertyData.description, '(length:', propertyData.description?.length, ')');
    console.log('Price:', propertyData.price, '(type:', typeof propertyData.price, ')');
    console.log('Location:', propertyData.location, '(length:', propertyData.location?.length, ')');
    console.log('Contact Phone:', propertyData.contact_phone, '(length:', propertyData.contact_phone?.length, ')');
    console.log('Property Type:', propertyData.property_type);
    console.log('Landlord ID:', propertyData.landlord_id);
    console.log('Images count:', propertyData.images?.length);
    console.log('=== END VALIDATION ===');
    
    // Create a new supabase client with the current session
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

    console.log('Insert result:', { data, error });
    if (error) {
      console.error('=== DATABASE INSERT ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Full error object:', error);
      console.error('=== END ERROR ===');
      
      // Enhanced error handling
      if (error.message.includes('new row violates row-level security policy')) {
        throw new Error('Huna ruhusa ya kuongeza nyumba. Hakikisha umeingia kama mwenye nyumba.');
      } else if (error.message.includes('duplicate key')) {
        throw new Error('Nyumba hii tayari ipo. Jaribu jina lingine.');
      } else if (error.code === '23514') {
        throw new Error('Taarifa ulizojaza hazikidhi mahitaji ya database. Angalia console kwa maelezo zaidi.');
      } else {
        throw new Error(`Hitilafu ya database: ${error.message}`);
      }
    }
    
    showSuccessToast('Nyumba yako imeongezwa kikamilifu');
  };

  const handleEditProperty = (property: Property): void => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      price: property.price?.toString() || '',
      location: property.location || '',
      full_address: property.full_address || '',
      property_type: property.property_type || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      area_sqm: property.area_sqm?.toString() || '',
      contact_phone: property.contact_phone || profile?.phone || '',
      contact_whatsapp_phone: property.contact_whatsapp_phone || profile?.phone || '',
      electricity: property.electricity || false,
      water: property.water || false,
      furnished: property.furnished || false,
      parking: property.parking || false,
      security: property.security || false,
      nearby_services: property.nearby_services || [],
      images: property.images || []
    });
    updateUIState({ showAddForm: true });
  };

  const handleDeleteProperty = async (id: string): Promise<void> => {
    if (!confirm('Una uhakika unataka kufuta tangazo hili?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Nyumba imefutwa kikamilifu');
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      showErrorToast('Imeshindikana kufuta nyumba');
    }
  };

  /**
   * FORM MANAGEMENT FUNCTIONS
   * ========================
   */
  const handleInputChange = (field: keyof PropertyFormData, value: any): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileInputChange = (field: keyof ProfileFormData, value: string): void => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string): void => {
    setFormData(prev => ({
      ...prev,
      nearby_services: prev.nearby_services.includes(service)
        ? prev.nearby_services.filter(s => s !== service)
        : [...prev.nearby_services, service]
    }));
  };

  const resetForm = (): void => {
    setFormData({
      title: '',
      description: '',
      price: '',
      location: '',
      full_address: '',
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      area_sqm: '',
      contact_phone: profile?.phone || '',
      contact_whatsapp_phone: profile?.phone || '',
      electricity: false,
      water: false,
      furnished: false,
      parking: false,
      security: false,
      nearby_services: [],
      images: []
    });
  };

  const handleCloseForm = (): void => {
    updateUIState({ showAddForm: false });
    setEditingProperty(null);
    resetForm();
  };



  /**
   * UTILITY FUNCTIONS
   * ================
   */
  const updateUIState = (updates: Partial<UIState>): void => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  const showSuccessToast = (message: string): void => {
    toast({
      title: t('common.success'),
      description: message
    });
  };

  const showErrorToast = (message: string): void => {
    toast({
      variant: "destructive",
      title: t('common.error'),
      description: message
    });
  };

  /**
   * LOADING STATE RENDERING
   * ======================
   */
  if (uiState.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          
          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
          
          {/* Property Management Section Skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            </div>
            <div className="p-6">
              <PropertyGridSkeleton count={6} viewMode="grid" />
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  /**
   * MAIN DASHBOARD RENDER
   * ====================
   * 
   * Orchestrates all dashboard components in a clean, organized layout.
   */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Dashboard Header */}
        <DashboardHeader
          profile={profile}
          user={user}
          isNewUser={uiState.isNewUser}
          onProfileEdit={() => updateUIState({ showProfileDialog: true })}
          onDismissWelcome={() => updateUIState({ isNewUser: false })}
          propertiesCount={properties.length}
        />

        {/* Quick Actions */}
        <QuickActions
          onAddProperty={() => updateUIState({ showAddForm: true })}
          onEditProfile={() => updateUIState({ showProfileDialog: true })}
          onShowHelp={() => updateUIState({ showHelpDialog: true })}
          isNewUser={uiState.isNewUser}
          propertiesCount={properties.length}
        />
        


        {/* Statistics Section */}
        <StatsSection properties={properties} />

        {/* Property Management */}
        <PropertyManagement
          properties={properties}
          searchQuery={uiState.searchQuery}
          filterStatus={uiState.filterStatus}
          viewMode={uiState.viewMode}
          onSearchChange={(query) => updateUIState({ searchQuery: query })}
          onFilterChange={(status) => updateUIState({ filterStatus: status })}
          onViewModeChange={(mode) => updateUIState({ viewMode: mode })}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
          onAddProperty={() => updateUIState({ showAddForm: true })}
        />



        {/* Property Form Modal */}
        <PropertyForm
          isOpen={uiState.showAddForm}
          editingProperty={editingProperty}
          formData={formData}
          profile={profile}
          submitting={uiState.submitting}
          onClose={handleCloseForm}
          onSubmit={handlePropertySubmit}
          onInputChange={handleInputChange}
          onServiceToggle={handleServiceToggle}
        />

        {/* Profile Settings Modal */}
        <ProfileSettings
          isOpen={uiState.showProfileDialog}
          profileForm={profileForm}
          profileLoading={uiState.profileLoading}
          onClose={() => updateUIState({ showProfileDialog: false })}
          onSubmit={handleProfileSubmit}
          onInputChange={handleProfileInputChange}
        />
        
        {/* Help Modal */}
        <GetHelpSection 
          isOpen={uiState.showHelpDialog}
          onClose={() => updateUIState({ showHelpDialog: false })}
        />
      </div>
    </div>
  );
};

export default Dashboard;