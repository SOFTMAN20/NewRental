/**
 * PROFILE PAGE
 * ============
 * 
 * User profile page - View and edit personal information
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Edit2, 
  Save, 
  X,
  Heart,
  FileText,
  LogOut,
  Shield,
  Search
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProfileData {
  full_name: string;
  phone: string;
  user_type: string;
  created_at?: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    phone: '',
    user_type: 'tenant'  // Changed from 'student' to 'tenant'
  });
  const [editForm, setEditForm] = useState<ProfileData>({
    full_name: '',
    phone: '',
    user_type: 'tenant'  // Changed from 'student' to 'tenant'
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Fetch profile data
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch profile using email (most reliable field)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error);
      }

      if (data) {
        console.log('Profile data fetched:', data);
        setProfile(data);
        setEditForm(data);
      } else {
        console.log('No profile found, attempting to create one');
        // Try to create profile if it doesn't exist
        const newProfileData = {
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          phone: user.user_metadata?.phone || '',
          user_type: user.user_metadata?.user_type || 'tenant'
        };
        
        // Try to insert the profile
        const { data: insertedData, error: insertError } = await supabase
          .from('profiles')
          .insert(newProfileData)
          .select()
          .single();
        
        if (insertError) {
          console.error('Error creating profile:', insertError);
          // If insert fails, still show the data from metadata
          setProfile(newProfileData);
          setEditForm(newProfileData);
        } else {
          console.log('Profile created successfully:', insertedData);
          setProfile(insertedData);
          setEditForm(insertedData);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kupata taarifa za profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    // Phone validation
    if (editForm.phone) {
      const phoneDigits = editForm.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10 || phoneDigits.length > 13) {
        toast({
          variant: 'destructive',
          title: 'Namba ya Simu Si Sahihi',
          description: 'Tafadhali jaza namba halisi ya simu (10-13 digits)'
        });
        return;
      }
    }

    try {
      setSaving(true);
      
      // Update using email since that's consistent across both schemas
      const result = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          user_type: editForm.user_type
        })
        .eq('email', user.email!);
      
      if (result.error) {
        console.error('Profile update error:', result.error);
        throw result.error;
      }

      // Refresh profile data
      await fetchProfile();
      setEditing(false);
      
      toast({
        title: 'Imefanikiwa!',
        description: 'Taarifa za profile zimesasishwa kikamilifu'
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: error?.message || 'Imeshindikana kusasisha taarifa'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(profile);
    setEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: 'Umetoka',
        description: 'Umefanikiwa kutoka kwenye akaunti yako'
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow digits, spaces, +, and -
    const sanitized = value.replace(/[^\d\s\+\-]/g, '');
    setEditForm(prev => ({ ...prev, phone: sanitized }));
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Angalia na hariri taarifa zako</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <div className="text-center">
                {/* Avatar */}
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-serengeti-500 text-white text-2xl font-bold">
                    {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profile.full_name || 'User'}
                </h2>

                {/* Email */}
                <p className="text-sm text-gray-600 mb-3">{user.email}</p>

                {/* User Type Badge */}
                <Badge className="mb-4">
                  {profile.user_type === 'tenant' ? '👨‍🎓 Student' : 
                   profile.user_type === 'professional' ? '💼 Professional' : 
                   '🏠 Property Host'}
                </Badge>

                <Separator className="my-4" />

                {/* Quick Stats */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">
                      {profile.created_at 
                        ? new Date(profile.created_at).toLocaleDateString()
                        : new Date(user.created_at).toLocaleDateString()
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email Verified</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Logout Button */}
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!editing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(true)}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* View Mode */}
              {!editing ? (
                <>
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium text-gray-900">
                          {profile.full_name || 'Not set'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium text-gray-900">
                          {profile.phone || 'Not set'}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* User Type */}
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-600">Account Type</p>
                        <p className="font-medium text-gray-900">
                          {profile.user_type === 'tenant' ? 'Student' : 
                           profile.user_type === 'professional' ? 'Professional' : 
                           'Property Host'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Edit Mode */
                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="full_name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="+255 XXX XXX XXX"
                      pattern="[\d\s\+\-]+"
                      minLength={10}
                      maxLength={15}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mfano: +255712345678 au 0712345678
                    </p>
                  </div>

                  {/* User Type */}
                  <div>
                    <Label htmlFor="user_type">Account Type</Label>
                    <select
                      id="user_type"
                      value={editForm.user_type}
                      onChange={(e) => setEditForm(prev => ({ ...prev, user_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="tenant">👨‍🎓 Student</option>
                      <option value="professional">💼 Professional</option>
                      <option value="landlord">🏠 Property Host</option>
                    </select>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/favorites')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  My Favorites
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/applications')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  My Applications
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/browse')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
