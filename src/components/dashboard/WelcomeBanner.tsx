import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface WelcomeBannerProps {
  profile: Profile | null;
  user: any;
  isNewUser: boolean;
  onProfileEdit: () => void;
  onDismissWelcome: () => void;
  propertiesCount: number;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  profile,
  user,
  isNewUser,
  onProfileEdit,
  onDismissWelcome,
  propertiesCount
}) => {
  const { t } = useTranslation();

  const getProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 0;
    if (profile.full_name) completion += 50;
    if (profile.phone) completion += 50;
    return completion;
  };

  const profileCompletion = getProfileCompletion();
  const isProfileComplete = profileCompletion === 100;

  if (isNewUser) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-serengeti-500 to-primary text-white mb-8">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6" />
                <h2 className="text-3xl font-bold">
                  🎉 {t('dashboard.welcome')}
                </h2>
              </div>
              <p className="text-xl opacity-90 max-w-2xl">
                {t('dashboard.welcomeMessage')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t('dashboard.completeAccount')}
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  {t('dashboard.viewGuide')}
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onDismissWelcome}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </div>
              {isProfileComplete && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {t('dashboard.welcomeUser', { name: profile?.full_name || 'Mwenye Nyumba' })}
              </h1>
              <p className="text-gray-600">
                {user?.email}
              </p>
              {profile?.phone && (
                <p className="text-sm text-gray-500">
                  📞 {profile.phone}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Profile Status */}
            <div className="flex items-center space-x-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{propertiesCount}</div>
                <div className="text-xs text-gray-600">{t('dashboard.properties')}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-bold text-gray-900">{profileCompletion}%</span>
                  {isProfileComplete ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="text-xs text-gray-600">{t('dashboard.account')}</div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={onProfileEdit}
              variant={isProfileComplete ? "outline" : "default"}
              className={!isProfileComplete ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isProfileComplete ? t('dashboard.updateAccount') : t('dashboard.completeAccountAction')}
            </Button>
          </div>
        </div>

        {/* Profile Completion Progress */}
        {!isProfileComplete && (
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{t('dashboard.accountProgress')}</span>
              <span className="text-sm text-gray-600">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {t('dashboard.completeInfo')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;