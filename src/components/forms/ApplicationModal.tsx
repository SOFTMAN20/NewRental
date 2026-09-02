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
    move_in_date: '',
    move_out_date: ''
  });

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({
        ...prev,
        applicant_email: user.email || ''
      }));
    }
  }, [user]);

  // Fetch user profile to pre-fill name and phone
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setFormData(prev => ({
          ...prev,
          applicant_name: data.full_name || '',
          applicant_phone: data.phone || ''
        }));
      }
    };

    if (isOpen) {
      fetchProfile();
    }
  }, [user, isOpen]);

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

    // Phone number validation - must be digits only and between 10-13 characters
    const phoneDigits = formData.applicant_phone.replace(/\D/g, ''); // Remove non-digits
    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      toast({
        variant: 'destructive',
        title: 'Namba ya Simu Si Sahihi',
        description: 'Tafadhali jaza namba halisi ya simu (10-13 digits)'
      });
      return;
    }

    // Check if phone contains only numbers (after removing spaces, +, -)
    const cleanPhone = formData.applicant_phone.replace(/[\s\+\-]/g, '');
    if (!/^\d+$/.test(cleanPhone)) {
      toast({
        variant: 'destructive',
        title: 'Namba ya Simu Si Sahihi',
        description: 'Namba ya simu lazima iwe na namba tu, sio maneno'
      });
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase
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
            move_out_date: formData.move_out_date || null,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;

      toast({
        title: 'Ombi Limetumwa!',
        description: 'Ombi lako limekamilika. Mwenye nyumba atawasiliana nawe hivi karibuni.'
      });

      // Reset form and close
      setFormData({
        applicant_name: '',
        applicant_email: user?.email || '',
        applicant_phone: '',
        message: '',
        move_in_date: '',
        move_out_date: ''
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
    // For phone number, only allow digits, spaces, +, and -
    if (field === 'applicant_phone') {
      const sanitized = value.replace(/[^\d\s\+\-]/g, '');
      setFormData(prev => ({ ...prev, [field]: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
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
              type="text"
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
              pattern="[\d\s\+\-]+"
              title="Jaza namba halisi ya simu (namba tu)"
              minLength={10}
              maxLength={15}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Mfano: +255712345678 au 0712345678
            </p>
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

          {/* Move Out Date (Optional) */}
          <div>
            <Label htmlFor="move_out_date">
              Tarehe ya Kutoka (Optional)
            </Label>
            <div className="relative">
              <Input
                id="move_out_date"
                type="date"
                value={formData.move_out_date}
                onChange={(e) => handleInputChange('move_out_date', e.target.value)}
                min={formData.move_in_date || new Date().toISOString().split('T')[0]}
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
