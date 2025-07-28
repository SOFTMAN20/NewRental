
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Home, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: searchParams.get('type') === 'landlord' ? 'landlord' : '',
    userType: 'landlord' // Always landlord since only landlords register
  });
  const navigate = useNavigate();
  const { signUp, user, loading } = useAuth();
  const { t } = useTranslation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Nywila hazifanani');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      user_type: formData.userType
    });

    if (!error) {
      // Navigate landlords to dashboard, tenants stay on current page
      if (formData.userType === 'landlord') {
        // Small delay to ensure profile is created
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      }
      
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userType: ''
      });
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-safari-50 to-serengeti-50">
      <Navigation />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Nyumba Link</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              {t('auth.becomeLandlord')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('auth.signUpSubtitle')}
            </p>
          </div>

          {/* Sign up form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('auth.signUp')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder={t('auth.fullNamePlaceholder')}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder={t('auth.phonePlaceholder')}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('auth.passwordRequirement')}
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.registering') : t('auth.registerAsLandlord')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('auth.alreadyHaveAccount')}{' '}
                  <Link to="/signin" className="text-primary hover:underline font-medium">
                    {t('auth.signInHere')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <Check className="h-4 w-4 mr-2" />
              {t('auth.landlordBenefits')}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>{t('auth.freeListings')}</li>
              <li>{t('auth.findTenants')}</li>
              <li>{t('auth.manageListings')}</li>
              <li>{t('auth.directContact')}</li>
              <li>{t('auth.getAnalytics')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
