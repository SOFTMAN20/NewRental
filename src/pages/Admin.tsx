/**
 * ADMIN.TSX - ADMIN DASHBOARD MAIN PAGE
 * =====================================
 * 
 * Main admin dashboard for platform management
 * Dashibodi kuu ya msimamizi wa jukwaa
 * 
 * FEATURES / VIPENGELE:
 * - User management (Usimamizi wa watumiaji)
 * - Property oversight (Udhibiti wa mali)
 * - System analytics (Uchambuzi wa mfumo)
 * - Settings and configuration (Mipangilio)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminProperties from "@/components/admin/AdminProperties";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminSettings from "@/components/admin/AdminSettings";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("overview");

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      console.log('🔍 Checking admin access...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Error getting user:', userError);
        navigate('/signin');
        return;
      }
      
      if (!user) {
        console.log('❌ No user found, redirecting to signin');
        navigate('/signin');
        return;
      }

      console.log('✅ User found:', user.email);

      // Check if user has admin role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, user_type, email, full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        console.log('Error code:', error.code);
        console.log('Error details:', error.details);
        console.log('Error hint:', error.hint);
        
        // If profile doesn't exist or role column doesn't exist
        if (error.code === 'PGRST116' || error.code === '42703') {
          console.warn('⚠️ Profile not found or role column missing. Please run admin migration.');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      console.log('✅ Profile fetched:', profile);
      console.log('📋 User role:', profile?.role);
      console.log('👤 User type:', profile?.user_type);

      const hasAdminAccess = profile?.role === 'admin' || profile?.role === 'super_admin';
      console.log(hasAdminAccess ? '✅ Admin access granted' : '❌ Admin access denied');
      
      setIsAdmin(hasAdminAccess);
      setIsLoading(false);

      if (!hasAdminAccess) {
        console.log('⏳ Redirecting to dashboard in 2 seconds...');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      console.error('💥 Exception checking admin access:', error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 bg-white border-r">
          <Skeleton className="h-full" />
        </div>
        <main className="flex-1 p-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Hamna ruhusa ya kuingia / No Access Permission</strong>
            <br />
            <br />
            Hamna ruhusa ya kuingia ukurasa huu. Unaelekezwa kwenye dashibodi.
            <br />
            You don't have permission to access this page. Redirecting to dashboard...
            <br />
            <br />
            <strong>🔧 If you're an admin:</strong>
            <br />
            1. Make sure you've run the admin migration SQL script
            <br />
            2. Check that the <code className="bg-gray-200 px-1 rounded">role</code> column exists in profiles table
            <br />
            3. Verify your user has <code className="bg-gray-200 px-1 rounded">role = 'admin'</code> or <code className="bg-gray-200 px-1 rounded">role = 'super_admin'</code>
            <br />
            <br />
            Check browser console (F12) for detailed error messages.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return <AdminOverview />;
      case "users":
        return <AdminUsers />;
      case "properties":
        return <AdminProperties />;
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50 flex">
      {/* Sidebar */}
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-6 sticky top-0 z-10 backdrop-blur-lg bg-white/95 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === currentView)?.label || "Admin"} Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  {menuItems.find(item => item.id === currentView)?.description || "Manage your platform"}
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Today</p>
                <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const menuItems = [
  {
    id: "overview",
    label: "Muhtasari",
    description: "Platform statistics and overview",
  },
  {
    id: "users",
    label: "Watumiaji",
    description: "Manage platform users",
  },
  {
    id: "properties",
    label: "Mali",
    description: "Manage all properties",
  },
  {
    id: "analytics",
    label: "Takwimu",
    description: "View detailed analytics",
  },
  {
    id: "settings",
    label: "Mipangilio",
    description: "Platform configuration",
  },
];

export default Admin;
