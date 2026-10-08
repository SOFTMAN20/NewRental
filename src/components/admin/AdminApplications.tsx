/**
 * ADMINAPPLICATIONS.TSX - APPLICATIONS MANAGEMENT
 * ===============================================
 * 
 * View and manage all property applications
 * See who applied, their status, and approve/reject
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
import { Search, Eye, CheckCircle, XCircle, User, Home, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Application {
  id: string;
  property_id: string;
  applicant_id?: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  message?: string;
  status: string;
  move_in_date: string;
  created_at: string;
  property?: {
    title: string;
    location: string;
  };
}

const AdminApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [searchQuery, statusFilter, applications]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);

      console.log('🔍 Fetching applications...');

      // Fetch applications
      const { data: appsData, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }

      console.log('✅ Applications fetched:', appsData?.length || 0);

      // Fetch property details for each application
      // Try to get basic property info - adjust fields based on what's available
      const appsWithProperties = await Promise.all(
        (appsData || []).map(async (app) => {
          const { data: propertyData, error: propError } = await supabase
            .from('properties')
            .select('title, full_address')
            .eq('id', app.property_id)
            .maybeSingle();
          
          if (propError) {
            console.warn(`⚠️ Failed to fetch property ${app.property_id}:`, propError.message, propError.code);
          } else if (propertyData) {
            console.log(`✅ Property fetched for ${app.property_id}:`, propertyData.title);
          } else {
            console.warn(`⚠️ Property ${app.property_id} not found in database`);
          }
          
          return {
            ...app,
            property: propertyData ? {
              title: propertyData.title,
              location: propertyData.full_address || 'N/A'
            } : undefined
          };
        })
      );

      console.log('✅ Applications with properties:', appsWithProperties.length);
      setApplications(appsWithProperties);
    } catch (error: any) {
      console.error('💥 Exception fetching applications:', error);
      
      let errorMessage = "Failed to fetch applications";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.applicant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicant_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${newStatus}`,
      });

      fetchApplications();
    } catch (error: any) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <CardTitle className="text-gray-900">Applications Management</CardTitle>
          <p className="text-sm text-gray-600">View and manage all property applications</p>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
              <Input
                placeholder="Search by property, tenant name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications Table */}
          <div className="rounded-md border border-gray-200 overflow-x-auto bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-white">
                  <TableHead className="text-gray-600">Property</TableHead>
                  <TableHead className="text-gray-600">Applicant</TableHead>
                  <TableHead className="text-gray-600">Contact</TableHead>
                  <TableHead className="text-gray-600">Move-in Date</TableHead>
                  <TableHead className="text-gray-600">Status</TableHead>
                  <TableHead className="text-gray-600">Applied Date</TableHead>
                  <TableHead className="text-right text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow className="border-gray-200">
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((application) => (
                    <TableRow key={application.id} className="border-gray-200 hover:bg-white">
                      {/* Property */}
                      <TableCell className="font-medium text-gray-900">
                        {application.property ? (
                          <div>
                            <div className="font-medium">{application.property.title}</div>
                            <div className="text-xs text-gray-500">{application.property.location}</div>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400">
                            Property not found
                          </div>
                        )}
                      </TableCell>
                      
                      {/* Applicant */}
                      <TableCell className="text-gray-900">
                        <div className="font-medium">{application.applicant_name || 'Unknown'}</div>
                      </TableCell>
                      
                      {/* Contact */}
                      <TableCell className="text-gray-600">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {application.applicant_email || 'N/A'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {application.applicant_phone || 'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Move-in Date */}
                      <TableCell className="text-gray-600">
                        {new Date(application.move_in_date).toLocaleDateString()}
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell>
                        {getStatusBadge(application.status)}
                      </TableCell>
                      
                      {/* Applied Date */}
                      <TableCell className="text-gray-600">
                        {new Date(application.created_at).toLocaleDateString()}
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedApplication(application);
                              setIsViewModalOpen(true);
                            }}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {application.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(application.id, 'approved')}
                                title="Approve"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(application.id, 'rejected')}
                                title="Reject"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredApplications.length} of {applications.length} applications
          </div>
        </CardContent>
      </Card>

      {/* View Application Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6 py-4">
              {/* Property Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Property Information
                </h3>
                <div className="space-y-2 text-sm">
                  {selectedApplication.property ? (
                    <>
                      <div><span className="text-gray-600">Title:</span> <span className="font-medium">{selectedApplication.property.title}</span></div>
                      <div><span className="text-gray-600">Location:</span> <span>{selectedApplication.property.location}</span></div>
                    </>
                  ) : (
                    <div className="text-gray-500">Property information not available</div>
                  )}
                </div>
              </div>

              {/* Applicant Info */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Applicant Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div><span className="text-gray-600">Full Name:</span> <span className="font-medium">{selectedApplication.applicant_name}</span></div>
                  <div><span className="text-gray-600">Email:</span> <span className="text-blue-600">{selectedApplication.applicant_email}</span></div>
                  <div><span className="text-gray-600">Phone:</span> <span className="text-green-600">{selectedApplication.applicant_phone}</span></div>
                  <div><span className="text-gray-600">Move-in Date:</span> <span>{new Date(selectedApplication.move_in_date).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-600">Status:</span> {getStatusBadge(selectedApplication.status)}</div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedApplication.message && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Message</h3>
                  <p className="text-sm text-gray-600">{selectedApplication.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => {
                        handleUpdateStatus(selectedApplication.id, 'approved');
                        setIsViewModalOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => {
                        handleUpdateStatus(selectedApplication.id, 'rejected');
                        setIsViewModalOpen(false);
                      }}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsViewModalOpen(false)} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminApplications;
