/**
 * APPLICATIONS PAGE
 * =================
 * 
 * Page ya maombi ya wapangaji - Tenant applications
 */

import React, { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/integrations/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  property_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  message: string | null;
  move_in_date: string;
  move_out_date: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  properties: {
    title: string;
    monthly_rent: number;
  };
}

const Applications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch applications for properties owned by this landlord
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          properties (
            title,
            monthly_rent
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kupata maombi'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Imefanikiwa',
        description: `Ombi lime${status === 'approved' ? 'kubaliwa' : 'kataliwa'} kikamilifu`
      });

      // Refresh applications
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kusasisha hali ya ombi'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-serengeti-50 to-kilimanjaro-50">
      <div className="flex">
        <DashboardSidebar profile={null} user={user} />
        
        <div className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Applications</h1>
              <p className="text-gray-600 mt-1">Maombi yote ya wapangaji wa nyumba zako</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Hakuna Maombi Bado
                  </h2>
                  <p className="text-gray-600">
                    Maombi ya wapangaji yataonekana hapa.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{application.properties.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            TZS {application.properties.monthly_rent.toLocaleString()}/month
                          </p>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Applicant Info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{application.applicant_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{application.applicant_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{application.applicant_phone}</span>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">
                              Move In: {new Date(application.move_in_date).toLocaleDateString()}
                            </span>
                          </div>
                          {application.move_out_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">
                                Move Out: {new Date(application.move_out_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {application.message && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                            <p className="text-sm text-gray-700">{application.message}</p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {application.status === 'pending' && (
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleUpdateStatus(application.id, 'approved')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
