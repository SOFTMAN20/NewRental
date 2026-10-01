/**
 * ADMINUSERS.TSX - USER MANAGEMENT COMPONENT
 * ==========================================
 * 
 * Manage platform users - view, edit roles, verify, and suspend
 */

import { useEffect, useState } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Shield, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  user_type: string | null;
  verification_status: string | null;
  created_at: string;
  properties_count?: number;
}

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editRole, setEditRole] = useState<string>("");
  const [editVerification, setEditVerification] = useState<string>("");
  const [editPhone, setEditPhone] = useState<string>("");
  const [editFullName, setEditFullName] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Fetching all users...');

      // Try using the admin function first (bypasses RLS)
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_users_for_admin');

      if (profilesError) {
        console.error('❌ RPC function error:', profilesError);
        console.log('⚠️ Falling back to direct query...');
        
        // Fallback to direct query if function doesn't exist
        const { data: fallbackProfiles, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallbackError) {
          console.error('❌ Direct query also failed:', fallbackError);
          throw fallbackError;
        }
        
        console.log('✅ Fallback query succeeded, found', fallbackProfiles?.length, 'users');
        
        // Use fallback data
        const userIds = fallbackProfiles?.map(p => p.id) || [];
        const { data: propertyCounts, error: propertiesError } = await supabase
          .from('properties')
          .select('landlord_id')
          .in('landlord_id', userIds);

        if (propertiesError) {
          console.warn('⚠️ Could not fetch property counts:', propertiesError);
        }

        // Count properties per user
        const propertyCountMap: { [key: string]: number } = {};
        propertyCounts?.forEach(p => {
          propertyCountMap[p.landlord_id] = (propertyCountMap[p.landlord_id] || 0) + 1;
        });

        // Combine data
        const usersWithCounts = fallbackProfiles?.map(profile => ({
          ...profile,
          properties_count: propertyCountMap[profile.id] || 0,
        })) || [];

        setUsers(usersWithCounts);
        return;
      }

      console.log('✅ RPC function succeeded, found', profiles?.length, 'users');

      // Fetch property counts for landlords
      const userIds = profiles?.map(p => p.id) || [];
      const { data: propertyCounts, error: propertiesError } = await supabase
        .from('properties')
        .select('landlord_id')
        .in('landlord_id', userIds);

      if (propertiesError) {
        console.warn('⚠️ Could not fetch property counts:', propertiesError);
      }

      // Count properties per user
      const propertyCountMap: { [key: string]: number } = {};
      propertyCounts?.forEach(p => {
        propertyCountMap[p.landlord_id] = (propertyCountMap[p.landlord_id] || 0) + 1;
      });

      // Combine data
      const usersWithCounts = profiles?.map(profile => ({
        ...profile,
        properties_count: propertyCountMap[profile.id] || 0,
      })) || [];

      console.log('✅ Final user list with counts:', usersWithCounts.length);
      setUsers(usersWithCounts);
    } catch (error: any) {
      console.error('💥 Error fetching users:', error);
      console.log('Error message:', error.message);
      console.log('Error details:', error);
      toast({
        title: "Hitilafu / Error",
        description: `Imeshindwa kupata watumiaji / Failed to fetch users: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    // Role filter - FIXED: Now uses user_type for landlord/student filtering
    if (roleFilter !== "all") {
      if (roleFilter === "landlord") {
        // Filter by user_type for landlords
        filtered = filtered.filter(user => user.user_type === 'landlord');
      } else if (roleFilter === "student") {
        // Filter by user_type for students/tenants/professionals
        filtered = filtered.filter(user => 
          user.user_type === 'student' || 
          user.user_type === 'tenant' || 
          user.user_type === 'professional'
        );
      } else {
        // Admin/super_admin filter by role
        filtered = filtered.filter(user => user.role === roleFilter);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setEditRole(user.role || 'student');
    setEditVerification(user.verification_status || 'unverified');
    setEditPhone(user.phone || '');
    setEditFullName(user.full_name || '');
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: editRole,
          verification_status: editVerification,
          phone: editPhone,
          full_name: editFullName,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: "Imefanikiwa / Success",
        description: "Taarifa za mtumiaji zimesasishwa / User information updated",
      });

      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Hitilafu / Error",
        description: "Imeshindwa kusasisha / Failed to update",
        variant: "destructive",
      });
    }
  };

  const getRoleBadge = (role: string | null, user_type?: string | null) => {
    // For admins, show role
    if (role === 'admin') {
      return <Badge variant="destructive">Admin</Badge>;
    }
    if (role === 'super_admin') {
      return <Badge className="bg-purple-600">Super Admin</Badge>;
    }
    
    // For non-admins, show user_type
    switch (user_type) {
      case 'landlord':
        return <Badge variant="default">Landlord</Badge>;
      case 'tenant':
      case 'student':
      case 'professional':
        return <Badge variant="secondary">Student</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getVerificationBadge = (status: string | null) => {
    switch (status) {
      case 'verified':
        return (
          <Badge className="bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-600">
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unverified</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                placeholder="Tafuta kwa jina, email au simu / Search by name, email or phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Chagua Wadhifa / Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wote / All Roles</SelectItem>
                <SelectItem value="student">Wanafunzi / Students</SelectItem>
                <SelectItem value="landlord">Wenye Nyumba / Landlords</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="super_admin">Super Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="rounded-md border border-gray-200 overflow-x-auto bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-white">
                  <TableHead className="text-gray-600">Name</TableHead>
                  <TableHead className="text-gray-600">Email</TableHead>
                  <TableHead className="text-gray-600">Phone</TableHead>
                  <TableHead className="text-gray-600">Type</TableHead>
                  <TableHead className="text-gray-600">Verification</TableHead>
                  <TableHead className="text-gray-600">Properties</TableHead>
                  <TableHead className="text-gray-600">Date</TableHead>
                  <TableHead className="text-right text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className="border-gray-200">
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-200 hover:bg-white">
                      <TableCell className="font-medium text-gray-900">
                        {user.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell className="text-gray-600">{user.phone || 'N/A'}</TableCell>
                      <TableCell>{getRoleBadge(user.role, user.user_type)}</TableCell>
                      <TableCell>{getVerificationBadge(user.verification_status)}</TableCell>
                      <TableCell>
                        {user.user_type === 'landlord' ? user.properties_count || 0 : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hariri Mtumiaji / Edit User</DialogTitle>
            <DialogDescription>
              Badilisha wadhifa na hali ya uthibitisho wa mtumiaji
              <br />
              Change user role and verification status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jina / Name</label>
              <Input 
                value={editFullName} 
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="Jina kamili / Full name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={selectedUser?.email || ''} disabled />
              <p className="text-xs text-muted-foreground">
                Email haiwezi kubadilishwa / Email cannot be changed
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Namba ya Simu / Phone Number</label>
              <Input 
                value={editPhone} 
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="+255 XXX XXX XXX"
              />
              <p className="text-xs text-muted-foreground">
                Weka namba sahihi ya simu / Enter valid phone number
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wadhifa / Role</label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Mwanafunzi / Student</SelectItem>
                  <SelectItem value="landlord">Mwenye Nyumba / Landlord</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Uthibitisho / Verification Status
              </label>
              <Select value={editVerification} onValueChange={setEditVerification}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unverified">Haujathibitishwa / Unverified</SelectItem>
                  <SelectItem value="pending">Inasubiri / Pending</SelectItem>
                  <SelectItem value="verified">Imethibitishwa / Verified</SelectItem>
                  <SelectItem value="rejected">Imekataliwa / Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Ghairi / Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Hifadhi / Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUsers;
