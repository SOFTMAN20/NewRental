
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Home, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

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
    userType: 'landlord' // Always landlord since only landlords register
  });
  const navigate = useNavigate();
  const { signUp, user, loading, checkUserTypeAndRedirect } = useAuth();
  const { t } = useTranslation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      checkUserTypeAndRedirect(navigate);
    }
  }, [user, loading, navigate, checkUserTypeAndRedirect]);

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
      // Navigate landlords to dashboard using the new redirect function
      if (formData.userType === 'landlord') {
        // Small delay to ensure profile is created
        setTimeout(() => {
          checkUserTypeAndRedirect(navigate);
        }, 1000);
      } else {
        navigate('/', { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-serengeti-500/20 to-transparent rounded-full blur-3xl"></div>
      
      <Navigation />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
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
          </motion.div>

          {/* Sign up form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          >
            <Card className="border-0 shadow-2xl backdrop-blur-md bg-white/95 relative overflow-hidden rounded-2xl">
              {/* Card Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-primary/5 pointer-events-none"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-serengeti-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
                  {t('auth.signUp')}
                </CardTitle>
                <p className="text-center text-sm text-gray-600 mt-2">Jisajili ili kuanza safari yako</p>
              </CardHeader>
              <CardContent className="relative z-10">
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
                  className="w-full bg-gradient-to-r from-primary via-serengeti-500 to-kilimanjaro-600 hover:from-primary/90 hover:via-serengeti-400 hover:to-kilimanjaro-500 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="bg-gradient-to-r from-primary/10 via-serengeti-50 to-kilimanjaro-50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 relative overflow-hidden"
          >
            {/* Benefits card overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-primary/10 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-serengeti-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
                  <Check className="h-4 w-4 text-white" />
                </div>
                {t('auth.landlordBenefits')}
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.freeListings')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-serengeti-500 rounded-full mr-3"></div>
                  {t('auth.findTenants')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-kilimanjaro-600 rounded-full mr-3"></div>
                  {t('auth.manageListings')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  {t('auth.directContact')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-serengeti-500 rounded-full mr-3"></div>
                  {t('auth.getAnalytics')}
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
