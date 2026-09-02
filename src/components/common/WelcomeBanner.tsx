import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import type { Tables } from '@/lib/integrations/supabase/types';

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

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 mb-4 sm:mb-6 lg:mb-8">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-serengeti-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 line-clamp-1">
              {t('dashboard.welcomeUser', { name: profile?.full_name || 'Mwenye Nyumba' })} 👋
            </h1>
            <p className="text-gray-600 text-sm sm:text-base line-clamp-1">
              {user?.email}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;