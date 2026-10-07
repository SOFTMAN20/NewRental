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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Property Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
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

          {/* Properties Table - Desktop View */}
          <div className="hidden lg:block rounded-md border border-gray-200 overflow-x-auto bg-gray-50">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-white">
                  <TableHead className="text-gray-600 w-20">Image</TableHead>
                  <TableHead className="text-gray-600">Title</TableHead>
                  <TableHead className="text-gray-600">Location</TableHead>
                  <TableHead className="text-gray-600">Price</TableHead>
                  <TableHead className="text-gray-600">Type</TableHead>
                  <TableHead className="text-gray-600">Host Info</TableHead>
                  <TableHead className="text-gray-600">Status</TableHead>
                  <TableHead className="text-gray-600">Date</TableHead>
                  <TableHead className="text-right text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.length === 0 ? (
                  <TableRow className="border-gray-200">
                    <TableCell colSpan={9} className="text-center text-gray-500">
                      No properties found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProperties.map((property) => (
                    <TableRow key={property.id} className="border-gray-200 hover:bg-white">
                      {/* Property Image */}
                      <TableCell>
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                          {property.images && property.images.length > 0 ? (
                            <img 
                              src={property.images[0]} 
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-property.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      {/* Title */}
                      <TableCell className="font-medium text-gray-900">
                        <div className="max-w-xs truncate" title={property.title}>
                          {property.title}
                        </div>
                      </TableCell>
                      
                      {/* Location */}
                      <TableCell className="text-gray-600">{property.location}</TableCell>
                      
                      {/* Price */}
                      <TableCell className="text-gray-900">TZS {(property.price || property.monthly_rent || 0).toLocaleString()}</TableCell>
                      
                      {/* Type */}
                      <TableCell className="capitalize text-gray-600">{property.property_type}</TableCell>
                      
                      {/* Host/Landlord Info */}
                      <TableCell className="text-gray-600">
                        <div className="space-y-1 min-w-[150px]">
                          <div className="font-medium text-gray-900">
                            {property.landlord?.full_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {property.landlord?.email}
                          </div>
                          {property.contact_phone && (
                            <div className="text-xs text-blue-600 font-mono">
                              📞 {property.contact_phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell>
                        {getStatusBadge(property.status, property.is_available)}
                      </TableCell>
                      
                      {/* Date */}
                      <TableCell>
                        {new Date(property.created_at).toLocaleDateString()}
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsViewModalOpen(true);
                            }}
                            title="Angalia / View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

          {/* Properties Cards - Mobile View */}
          <div className="lg:hidden space-y-4">
            {filteredProperties.length === 0 ? (
              <Card className="bg-gray-50">
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-gray-500">No properties found</p>
                </CardContent>
              </Card>
            ) : (
              filteredProperties.map((property) => (
                <Card key={property.id} className="bg-white border-gray-200">
                  <CardContent className="p-4 space-y-3">
                    {/* Title and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm flex-1">
                        {property.title}
                      </h3>
                      {getStatusBadge(property.status, property.is_available)}
                    </div>

                    {/* Location */}
                    <p className="text-sm text-gray-600">📍 {property.location}</p>

                    {/* Price and Type */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-gray-900">
                        TZS {(property.price || property.monthly_rent || 0).toLocaleString()}
                      </span>
                      <span className="text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded text-xs">
                        {property.property_type}
                      </span>
                    </div>

                    {/* Landlord */}
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Landlord:</span> {property.landlord?.full_name || 'Unknown'}
                    </div>

                    {/* Date */}
                    <div className="text-xs text-gray-500">
                      {new Date(property.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/property/${property.id}`)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleAvailability(property.id, property.is_available)}
                        className="flex-1"
                      >
                        {property.is_available ? (
                          <>
                            <XCircle className="h-4 w-4 mr-2 text-orange-600" />
                            <span className="text-orange-600">Deactivate</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            <span className="text-green-600">Activate</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedProperty(property);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-600">
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

      {/* View Property Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Property Details</DialogTitle>
          </DialogHeader>

          {selectedProperty && (
            <div className="space-y-6 py-4">
              {/* Property Images */}
              {selectedProperty.images && selectedProperty.images.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Property Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProperty.images.slice(0, 6).map((image, index) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${selectedProperty.title} ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Title:</span> <span className="font-medium">{selectedProperty.title}</span></div>
                    <div><span className="text-gray-600">Location:</span> <span className="font-medium">{selectedProperty.location}</span></div>
                    <div><span className="text-gray-600">Monthly Rent:</span> <span className="font-bold text-primary">TZS {(selectedProperty.monthly_rent || 0).toLocaleString()}</span></div>
                    <div><span className="text-gray-600">Type:</span> <span className="capitalize">{selectedProperty.property_type}</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Host Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedProperty.landlord?.full_name || 'Unknown'}</span></div>
                    <div><span className="text-gray-600">Email:</span> <span className="text-blue-600">{selectedProperty.landlord?.email}</span></div>
                    <div><span className="text-gray-600">Phone:</span> <span className="text-green-600">{selectedProperty.contact_phone || 'N/A'}</span></div>
                    <div><span className="text-gray-600">WhatsApp:</span> <span className="text-green-600">{selectedProperty.contact_whatsapp_phone || 'N/A'}</span></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={() => navigate(`/property/${selectedProperty.id}`)} variant="outline">
                  View Full Page
                </Button>
                <Button onClick={() => setIsViewModalOpen(false)}>
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

export default AdminProperties;
