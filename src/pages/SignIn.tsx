
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();
  const { t } = useTranslation();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (!error) {
      navigate('/', { replace: true });
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
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
              {t('auth.welcomeBack')}
            </h2>
            <p className="mt-2 text-gray-600">
              {t('auth.signInSubtitle')}
            </p>
          </div>

          {/* Sign in form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t('auth.signIn')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder={t('auth.passwordPlaceholder')}
                      required
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">{t('auth.rememberMe')}</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.signing') : t('auth.signIn')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('auth.noAccount')}{' '}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    {t('auth.signUpHere')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info card */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              {t('auth.whyRegister')}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>{t('auth.saveProperties')}</li>
              <li>{t('auth.getNotifications')}</li>
              <li>{t('auth.contactLandlords')}</li>
              <li>{t('auth.listProperty')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
