/**
 * SETTINGS PAGE
 * =============
 * 
 * Page ya mipangilio - Account settings
 */

import React from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <div className="flex">
        <DashboardSidebar profile={null} user={user} />
        
        <div className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mipangilio</h1>
              <p className="text-gray-600 mt-1">Simamia akaunti yako na mipangilio</p>
            </div>

            <Card>
              <CardContent className="p-12 text-center">
                <SettingsIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Mipangilio Inakuja Hivi Karibuni
                </h2>
                <p className="text-gray-600">
                  Kipengele hiki bado kinaundwa. Utaweza kubadilisha mipangilio ya akaunti yako hapa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
