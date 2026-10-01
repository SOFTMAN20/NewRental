/**
 * ADMINOVERVIEW.TSX - ADMIN DASHBOARD OVERVIEW
 * ===========================================
 * 
 * Overview statistics and key metrics for platform management
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, TrendingUp, MessageSquare, AlertCircle, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface DashboardStats {
  totalUsers: number;
  totalLandlords: number;
  totalStudents: number;
  totalProperties: number;
  activeProperties: number;
  rentedProperties: number;
  totalInquiries: number;
  recentUsers: number;
  recentProperties: number;
  monthlyData: Array<{ month: string; users: number; properties: number }>;
  propertyTypeData: Array<{ name: string; value: number }>;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('role, created_at');

      if (usersError) throw usersError;

      // Fetch property statistics
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('is_available, status, created_at');

      if (propertiesError) throw propertiesError;

      // Fetch inquiry statistics
      const { count: inquiryCount } = await supabase
        .from('property_inquiries')
        .select('*', { count: 'exact', head: true });

      // Calculate statistics
      const totalUsers = users?.length || 0;
      const totalLandlords = users?.filter(u => u.role === 'landlord').length || 0;
      const totalStudents = users?.filter(u => u.role === 'student').length || 0;
      
      const totalProperties = properties?.length || 0;
      const activeProperties = properties?.filter(p => p.is_available && p.status === 'active').length || 0;
      const rentedProperties = properties?.filter(p => p.status === 'rented').length || 0;

      // Recent statistics (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const recentUsers = users?.filter(u => new Date(u.created_at) > sevenDaysAgo).length || 0;
      const recentProperties = properties?.filter(p => new Date(p.created_at) > sevenDaysAgo).length || 0;

      // Monthly data for charts (last 6 months)
      const monthlyData = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthUsers = users?.filter(u => {
          const created = new Date(u.created_at);
          return created >= monthStart && created <= monthEnd;
        }).length || 0;
        
        const monthProps = properties?.filter(p => {
          const created = new Date(p.created_at);
          return created >= monthStart && created <= monthEnd;
        }).length || 0;
        
        monthlyData.push({
          month: monthNames[date.getMonth()],
          users: monthUsers,
          properties: monthProps,
        });
      }

      // Property type distribution
      const typeCounts: { [key: string]: number } = {};
      properties?.forEach(p => {
        const type = p.property_type || 'Unknown';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
      
      const propertyTypeData = Object.entries(typeCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

      setStats({
        totalUsers,
        totalLandlords,
        totalStudents,
        totalProperties,
        activeProperties,
        rentedProperties,
        totalInquiries: inquiryCount || 0,
        recentUsers,
        recentProperties,
        monthlyData,
        propertyTypeData,
      });
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Hitilafu katika kupata takwimu. Tafadhali jaribu tena.
          <br />
          Error fetching statistics: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Users */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-blue-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3" />
              +{stats.recentUsers} this week
            </p>
          </CardContent>
        </Card>

        {/* Landlords */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-purple-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Landlords
            </CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalLandlords}</div>
            <p className="text-xs text-gray-500 mt-2">
              {((stats.totalLandlords / stats.totalUsers) * 100).toFixed(1)}% of users
            </p>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-green-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Students
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-2">
              {((stats.totalStudents / stats.totalUsers) * 100).toFixed(1)}% of users
            </p>
          </CardContent>
        </Card>

        {/* Total Properties */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-orange-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Properties
            </CardTitle>
            <Home className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalProperties}</div>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-2">
              <TrendingUp className="h-3 w-3" />
              +{stats.recentProperties} this week
            </p>
          </CardContent>
        </Card>

        {/* Active Properties */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-emerald-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Available Properties
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeProperties}</div>
            <p className="text-xs text-gray-500 mt-2">
              {((stats.activeProperties / stats.totalProperties) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        {/* Rented Properties */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-yellow-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Rented Properties
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.rentedProperties}</div>
            <p className="text-xs text-gray-500 mt-2">
              {((stats.rentedProperties / stats.totalProperties) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        {/* Total Inquiries */}
        <Card className="bg-gray-900 border-gray-800 overflow-hidden relative group hover:border-pink-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Total Inquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalInquiries}</div>
            <p className="text-xs text-gray-500 mt-2">
              All communications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-400">
            Use the sidebar navigation to manage users, properties, and view detailed analytics.
          </div>
        </CardContent>
      </Card>

      {/* Growth Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Growth Bar Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Monthly Growth
            </CardTitle>
            <p className="text-sm text-gray-400">Users and Properties (Last 6 Months)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="users" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="properties" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-400">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-sm text-gray-400">Properties</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Types Pie Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-500" />
              Property Distribution
            </CardTitle>
            <p className="text-sm text-gray-400">By Property Type</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.propertyTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.propertyTypeData.map((entry, index) => {
                    const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <p className="text-sm text-gray-400">Latest platform updates</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">New registrations</p>
                <p className="text-xs text-gray-400">{stats.recentUsers} new users this week</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">New properties listed</p>
                <p className="text-xs text-gray-400">{stats.recentProperties} properties this week</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-500" />
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Active inquiries</p>
                <p className="text-xs text-gray-400">{stats.totalInquiries} total communications</p>
              </div>
              <MessageSquare className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
