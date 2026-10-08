/**
 * APPLICATION MODAL
 * =================
 * 
 * Modal form for submitting property applications
 */

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_phone: '',
    message: '',
    move_in_date: ''
  });

  // Pre-fill from user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData(prev => ({
          ...prev,
          applicant_name: data.full_name || '',
          applicant_email: user.email || '',
          applicant_phone: data.phone || ''
        }));
      }
    };

    if (isOpen && user) {
      fetchProfile();
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Lazima uingie kwanza kabla ya kuomba'
      });
      return;
    }

    // Validation
    if (!formData.applicant_name || !formData.applicant_email || !formData.applicant_phone || !formData.move_in_date) {
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Tafadhali jaza taarifa zote za lazima'
      });
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('applications')
        .insert([
          {
            property_id: propertyId,
            applicant_id: user.id,
            applicant_name: formData.applicant_name,
            applicant_email: formData.applicant_email,
            applicant_phone: formData.applicant_phone,
            message: formData.message || null,
            move_in_date: formData.move_in_date,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Ombi Limetumwa!',
        description: 'Ombi lako limekamilika. Mwenye nyumba atawasiliana nawe hivi karibuni.'
      });

      // Reset form and close
      setFormData({
        applicant_name: '',
        applicant_email: '',
        applicant_phone: '',
        message: '',
        move_in_date: ''
      });
      onClose();

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Hitilafu',
        description: 'Imeshindikana kutuma ombi. Tafadhali jaribu tena.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Apply for {propertyTitle}
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Jaza fomu hii ili kuomba kupanga nyumba hii
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Name */}
          <div>
            <Label htmlFor="applicant_name">
              Jina Kamili <span className="text-red-500">*</span>
            </Label>
            <Input
              id="applicant_name"
              value={formData.applicant_name}
              onChange={(e) => handleInputChange('applicant_name', e.target.value)}
              placeholder="Jina lako kamili"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="applicant_email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="applicant_email"
              type="email"
              value={formData.applicant_email}
              onChange={(e) => handleInputChange('applicant_email', e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="applicant_phone">
              Namba ya Simu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="applicant_phone"
              type="tel"
              value={formData.applicant_phone}
              onChange={(e) => handleInputChange('applicant_phone', e.target.value)}
              placeholder="+255 XXX XXX XXX"
              required
            />
          </div>

          {/* Move In Date */}
          <div>
            <Label htmlFor="move_in_date">
              Tarehe ya Kuhamia <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="move_in_date"
                type="date"
                value={formData.move_in_date}
                onChange={(e) => handleInputChange('move_in_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">
              Ujumbe (Optional)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Andika ujumbe wowote kwa mwenye nyumba..."
              rows={4}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={submitting}
            >
              Ghairi
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={submitting}
            >
              {submitting ? 'Inatuma...' : 'Tuma Ombi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
