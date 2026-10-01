/**
 * ADMINPROPERTIES.TSX - PROPERTY MANAGEMENT COMPONENT
 * ===================================================
 * 
 * Manage all properties - view, edit, verify, and moderate
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
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface PropertyWithLandlord {
  id: string;
  title: string;
  location: string;
  price: number;
  property_type: string;
  status: string;
  is_available: boolean;
  created_at: string;
  landlord_id: string;
  landlord?: {
    full_name: string | null;
    email: string;
  };
}

const AdminProperties = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyWithLandlord[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<PropertyWithLandlord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithLandlord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchQuery, statusFilter, properties]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          landlord:profiles!properties_landlord_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Handle the landlord array structure from Supabase
      const processedData = data?.map(property => ({
        ...property,
        landlord: Array.isArray(property.landlord) && property.landlord.length > 0
          ? property.landlord[0]
          : property.landlord
      })) || [];

      setProperties(processedData);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Hitilafu / Error",
        description: "Imeshindwa kupata mali / Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.landlord?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleToggleAvailability = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ is_available: !currentStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: "Imefanikiwa / Success",
        description: "Hali ya mali imebadilishwa / Property status updated",
      });

      fetchProperties();
    } catch (error: any) {
      console.error('Error updating property:', error);
      toast({
        title: "Hitilafu / Error",
        description: "Imeshindwa kusasisha / Failed to update",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedProperty.id);

      if (error) throw error;

      toast({
        title: "Imefanikiwa / Success",
        description: "Mali imefutwa / Property deleted",
      });

      setIsDeleteDialogOpen(false);
      fetchProperties();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: "Hitilafu / Error",
        description: "Imeshindwa kufuta / Failed to delete",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, isAvailable: boolean) => {
    if (!isAvailable) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge className="bg-green-600">Active</Badge>;
      case 'rented':
        return <Badge className="bg-orange-600">Rented</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
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
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tafuta kwa jina, eneo au mwenye nyumba / Search by title, location or landlord"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Chagua Hali / Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Zote / All Status</SelectItem>
                <SelectItem value="active">Zinazotumika / Active</SelectItem>
                <SelectItem value="rented">Zimepangwa / Rented</SelectItem>
                <SelectItem value="pending">Inasubiri / Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Properties Table */}
          <div className="rounded-md border border-gray-800 overflow-x-auto bg-gray-950">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-900">
                  <TableHead className="text-gray-400">Title</TableHead>
                  <TableHead className="text-gray-400">Location</TableHead>
                  <TableHead className="text-gray-400">Price</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Landlord</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow className="border-gray-800">
                    <TableCell colSpan={8} className="text-center text-gray-500">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id} className="border-gray-800 hover:bg-gray-900">
                      <TableCell className="font-medium text-white">
                        {property.title}
                      </TableCell>
                      <TableCell className="text-gray-400">{property.location}</TableCell>
                      <TableCell className="text-white">TZS {(property.price || property.monthly_rent || 0).toLocaleString()}</TableCell>
                      <TableCell className="capitalize text-gray-400">{property.property_type}</TableCell>
                      <TableCell className="text-gray-400">
                        {property.landlord?.full_name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(property.status, property.is_available)}
                      </TableCell>
                      <TableCell>
                        {new Date(property.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/property/${property.id}`)}
                            title="Angalia / View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleAvailability(property.id, property.is_available)}
                            title={property.is_available ? "Zima / Deactivate" : "Washa / Activate"}
                          >
                            {property.is_available ? (
                              <XCircle className="h-4 w-4 text-orange-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Futa / Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thibitisha Kufuta / Confirm Deletion</DialogTitle>
            <DialogDescription>
              Je, una uhakika unataka kufuta mali hii? Hatua hii haiwezi kutenduliwa.
              <br />
              Are you sure you want to delete this property? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedProperty && (
            <div className="py-4">
              <p className="font-semibold">{selectedProperty.title}</p>
              <p className="text-sm text-muted-foreground">{selectedProperty.location}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Ghairi / Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProperty}>
              Futa / Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminProperties;
