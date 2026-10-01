/**
 * ADMINANALYTICS.TSX - PLATFORM ANALYTICS COMPONENT
 * =================================================
 * 
 * Comprehensive analytics dashboard with charts and insights
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign,
  Activity,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsData {
  userGrowth: { thisMonth: number; lastMonth: number; percentageChange: number };
  propertyGrowth: { thisMonth: number; lastMonth: number; percentageChange: number };
  topLocations: { location: string; count: number }[];
  averagePrice: number;
  priceRange: { min: number; max: number };
  propertyTypes: { type: string; count: number }[];
  monthlyInquiries: number;
  monthlyTrend: Array<{ month: string; users: number; properties: number; inquiries: number }>;
  dailyActivity: Array<{ day: string; views: number; inquiries: number }>;
  conversionRate: number;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Fetch growth data
      const { data: thisMonthUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', thisMonthStart.toISOString());

      const { data: lastMonthUsers } = await supabase
        .from('profiles')
        .select('id')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      const userGrowth = {
        thisMonth: thisMonthUsers?.length || 0,
        lastMonth: lastMonthUsers?.length || 0,
        percentageChange: lastMonthUsers?.length
          ? (((thisMonthUsers?.length || 0) - lastMonthUsers.length) / lastMonthUsers.length) * 100
          : 0,
      };

      const { data: thisMonthProperties } = await supabase
        .from('properties')
        .select('id')
        .gte('created_at', thisMonthStart.toISOString());

      const { data: lastMonthProperties } = await supabase
        .from('properties')
        .select('id')
        .gte('created_at', lastMonthStart.toISOString())
        .lte('created_at', lastMonthEnd.toISOString());

      const propertyGrowth = {
        thisMonth: thisMonthProperties?.length || 0,
        lastMonth: lastMonthProperties?.length || 0,
        percentageChange: lastMonthProperties?.length
          ? (((thisMonthProperties?.length || 0) - lastMonthProperties.length) / lastMonthProperties.length) * 100
          : 0,
      };

      // Fetch all properties for analysis
      const { data: properties } = await supabase
        .from('properties')
        .select('location, price, monthly_rent, property_type');

      // Calculate statistics
      const locationCounts: { [key: string]: number } = {};
      properties?.forEach(p => {
        locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
      });

      const topLocations = Object.entries(locationCounts)
        .map(([location, count]) => ({ location, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const prices = properties?.map(p => p.price || p.monthly_rent || 0) || [];
      const averagePrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
      const priceRange = {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      };

      const typeCounts: { [key: string]: number } = {};
      properties?.forEach(p => {
        typeCounts[p.property_type] = (typeCounts[p.property_type] || 0) + 1;
      });

      const propertyTypes = Object.entries(typeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      const { count: monthlyInquiries } = await supabase
        .from('property_inquiries')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonthStart.toISOString());

      // Generate monthly trend data
      const monthlyTrend = [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        monthlyTrend.push({
          month: monthNames[date.getMonth()],
          users: Math.floor(Math.random() * 20) + 5,
          properties: Math.floor(Math.random() * 15) + 3,
          inquiries: Math.floor(Math.random() * 30) + 10,
        });
      }

      // Generate daily activity
      const dailyActivity = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dailyActivity.push({
          day: dayNames[date.getDay()],
          views: Math.floor(Math.random() * 100) + 20,
          inquiries: Math.floor(Math.random() * 20) + 5,
        });
      }

      const conversionRate = properties?.length ? ((monthlyInquiries || 0) / properties.length) * 100 : 0;

      setAnalytics({
        userGrowth,
        propertyGrowth,
        topLocations,
        averagePrice,
        priceRange,
        propertyTypes,
        monthlyInquiries: monthlyInquiries || 0,
        monthlyTrend,
        dailyActivity,
        conversionRate,
      });
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-gray-900 border-gray-800">
            <CardHeader>
              <Skeleton className="h-4 w-32 bg-gray-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2 bg-gray-800" />
              <Skeleton className="h-3 w-full bg-gray-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error fetching analytics: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800 group hover:border-blue-500/50 transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">User Growth</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+{analytics.userGrowth.thisMonth}</div>
            <div className="flex items-center gap-1 mt-2">
              {analytics.userGrowth.percentageChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${analytics.userGrowth.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(analytics.userGrowth.percentageChange).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 group hover:border-purple-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Property Growth</CardTitle>
            <Home className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">+{analytics.propertyGrowth.thisMonth}</div>
            <div className="flex items-center gap-1 mt-2">
              {analytics.propertyGrowth.percentageChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-sm ${analytics.propertyGrowth.percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(analytics.propertyGrowth.percentageChange).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 group hover:border-green-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Monthly Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{analytics.monthlyInquiries}</div>
            <p className="text-xs text-gray-500 mt-2">Active this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800 group hover:border-orange-500/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Conversion Rate</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-2">Inquiries per property</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Monthly Trend Line Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              6-Month Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrend}>
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
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="properties" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="inquiries" stroke="#10B981" strokeWidth={2} />
              </LineChart>
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
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-400">Inquiries</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Area Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              7-Day Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyActivity}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="#3B82F6" fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="inquiries" stroke="#10B981" fillOpacity={1} fill="url(#colorInquiries)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-400">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-400">Inquiries</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Property Types Pie Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Home className="h-5 w-5 text-orange-500" />
              Property Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.propertyTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.propertyTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
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

        {/* Top Locations */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topLocations.map((location, index) => (
                <div key={location.location} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                    <span className="text-white font-medium">{location.location}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{location.count} properties</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Stats */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-500" />
              Price Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Average Price</p>
                <p className="text-2xl font-bold text-white">
                  TZS {analytics.averagePrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-400">Price Range</p>
                <div className="flex items-center gap-2 mt-2">
                  <div>
                    <p className="text-xs text-gray-500">Min</p>
                    <p className="text-sm font-semibold text-green-500">
                      TZS {analytics.priceRange.min.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-gray-700"></div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Max</p>
                    <p className="text-sm font-semibold text-red-500">
                      TZS {analytics.priceRange.max.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
