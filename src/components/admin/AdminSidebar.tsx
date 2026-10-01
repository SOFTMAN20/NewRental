/**
 * ADMINSIDEBAR.TSX - ADMIN DASHBOARD SIDEBAR
 * ==========================================
 * 
 * Sidebar navigation for admin dashboard
 */

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Home,
  BarChart3,
  Settings,
  Shield,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AdminSidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const AdminSidebar = ({ currentView, onViewChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      id: "overview",
      label: "Muhtasari",
      labelEn: "Overview",
      icon: LayoutDashboard,
      description: "Platform statistics",
    },
    {
      id: "users",
      label: "Watumiaji",
      labelEn: "Users",
      icon: Users,
      description: "Manage users",
    },
    {
      id: "properties",
      label: "Mali",
      labelEn: "Properties",
      icon: Home,
      description: "Manage properties",
    },
    {
      id: "analytics",
      label: "Takwimu",
      labelEn: "Analytics",
      icon: BarChart3,
      description: "View analytics",
    },
    {
      id: "settings",
      label: "Mipangilio",
      labelEn: "Settings",
      icon: Settings,
      description: "Platform settings",
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-20 left-4 z-50 lg:hidden bg-white shadow-md"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40",
          isCollapsed ? "w-0 lg:w-20" : "w-64",
          "lg:translate-x-0",
          isCollapsed && "lg:translate-x-0",
          !isCollapsed && "translate-x-0",
          isCollapsed && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-white">Wanachuo</h2>
                  <p className="text-xs text-gray-400">Admin Panel</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
                <Shield className="h-5 w-5 text-white" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  isCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    isCollapsed && "justify-center"
                  )}
                >
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "drop-shadow-md")} />
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm">
                        {item.label}
                      </div>
                      <div className={cn(
                        "text-xs",
                        isActive ? "text-white/90" : "text-gray-500"
                      )}>
                        {item.labelEn}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <Link to="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full text-gray-400 hover:text-white hover:bg-gray-800",
                  isCollapsed && "px-0"
                )}
              >
                {isCollapsed ? (
                  "←"
                ) : (
                  <>← Back to Home</>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default AdminSidebar;
