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
import Navigation from '@/components/Navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsSection from '@/components/dashboard/StatsSection';
import PropertyManagement from '@/components/dashboard/PropertyManagement';
import PropertyForm from '@/components/dashboard/PropertyForm';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import GetHelpSection from '@/components/dashboard/GetHelpSection';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/integrations/supabase/types';

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
      handleCloseForm();
      await fetchProperties();
    } catch (error) {
      console.error('Error saving property:', error);
      const errorMessage = editingProperty 
        ? 'Imeshindikana kusasisha nyumba yako. Jaribu tena.' 
        : 'Imeshindikana kuongeza nyumba yako. Jaribu tena.';
      showErrorToast(errorMessage);
    } finally {
      console.log('Property submission process completed');
      updateUIState({ submitting: false });
    }
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
    return propertyData;
  };

  const updateExistingProperty = async (propertyData: any): Promise<void> => {
    console.log('Updating property with ID:', editingProperty?.id);
    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', editingProperty!.id)
      .select();

    console.log('Update result:', { data, error });
    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    
    showSuccessToast('Nyumba yako imesasishwa kikamilifu');
  };

  const createNewProperty = async (propertyData: any): Promise<void> => {
    console.log('Creating new property...');
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select();

    console.log('Insert result:', { data, error });
    if (error) {
      console.error('Insert error:', error);
      throw error;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
              <p className="text-lg text-gray-600">{t('dashboard.loading')}</p>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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