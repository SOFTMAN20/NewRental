/**
 * DASHBOARD SIDEBAR - NAVIGATION COMPONENT
 * ========================================
 * 
 * Sidebar ya kusimamia navigation kwenye dashboard
 * 
 * FEATURES:
 * - Responsive sidebar (collapsible on mobile)
 * - Navigation menu items with icons
 * - Active state highlighting
 * - User profile section at bottom
 * - Logout functionality
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Building2,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Plus,
  Search,
  FileText,
  Users
} from 'lucide-react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/lib/integrations/supabase/types';

type Profile = Tables<'profiles'>;

interface DashboardSidebarProps {
  profile: Profile | null;
  user: any;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ profile, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Menu items
  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      label: 'My Properties',
      icon: <Building2 className="h-5 w-5" />,
      path: '/dashboard'
    },
    {
      label: 'Add Property',
      icon: <Plus className="h-5 w-5" />,
      path: '/add-property'
    },
    {
      label: 'Applications',
      icon: <FileText className="h-5 w-5" />,
      path: '/applications',
      badge: 0
    },
    {
      label: 'Leads',
      icon: <Users className="h-5 w-5" />,
      path: '/leads',
      badge: 0
    },
    {
      label: 'Meseji',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/messages',
      badge: 0
    },
    {
      label: 'Mipangilio',
      icon: <Settings className="h-5 w-5" />,
      path: '/settings'
    }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'Umetoka',
        description: 'Umetoka kwenye akaunti yako kikamilifu'
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kutoka. Jaribu tena.'
      });
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-lg z-[60]
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          w-64 flex flex-col
          overflow-y-auto
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-serengeti-500 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Wanachuo.com</h2>
              <p className="text-xs text-gray-500">Student Housing</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`
                      ${isActive(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-primary'}
                    `}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        <Separator />

        {/* Logout Button */}
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Toka
          </Button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
