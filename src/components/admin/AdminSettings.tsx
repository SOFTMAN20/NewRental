/**
 * ADMINSETTINGS.TSX - ADMIN SETTINGS COMPONENT
 * ============================================
 * 
 * Platform configuration and system settings - Clean & Modern Design
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Mail, 
  Save,
  Phone,
  Building2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Platform Settings State
  const [platformName, setPlatformName] = useState("Nyumba Link");
  const [supportEmail, setSupportEmail] = useState("info@nyumbalink.co.tz");
  const [supportPhone, setSupportPhone] = useState("+255 750 929 317");
  const [companyWhatsApp, setCompanyWhatsApp] = useState("+255792072561");
  const [useCompanyContact, setUseCompanyContact] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [propertyApprovalRequired, setPropertyApprovalRequired] = useState(false);

  // Email Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [welcomeEmailEnabled, setWelcomeEmailEnabled] = useState(true);
  const [inquiryEmailEnabled, setInquiryEmailEnabled] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Fetching platform settings...');
      
      const { data, error } = await supabase
        .from('platform_settings')
        .select('key, value');

      if (error) {
        console.error('❌ Error fetching settings:', error);
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.warn('⚠️ platform_settings table not found. Using defaults.');
          setIsLoading(false);
          return;
        }
        throw error;
      }

      console.log('✅ Settings fetched:', data?.length || 0, 'settings');

      data?.forEach(setting => {
        switch (setting.key) {
          case 'platform_name':
            setPlatformName(setting.value || 'Nyumba Link');
            break;
          case 'support_email':
            setSupportEmail(setting.value || '');
            break;
          case 'support_phone':
            setSupportPhone(setting.value || '');
            break;
          case 'company_whatsapp':
            setCompanyWhatsApp(setting.value || '');
            break;
          case 'use_company_contact':
            setUseCompanyContact(setting.value === 'true');
            break;
          case 'maintenance_mode':
            setMaintenanceMode(setting.value === 'true');
            break;
          case 'registration_open':
            setRegistrationOpen(setting.value === 'true');
            break;
          case 'property_approval_required':
            setPropertyApprovalRequired(setting.value === 'true');
            break;
          case 'email_notifications':
            setEmailNotifications(setting.value === 'true');
            break;
          case 'welcome_email':
            setWelcomeEmailEnabled(setting.value === 'true');
            break;
          case 'inquiry_email':
            setInquiryEmailEnabled(setting.value === 'true');
            break;
        }
      });
    } catch (error: any) {
      console.error('💥 Error fetching settings:', error);
      toast({
        title: "Error",
        description: `Failed to fetch settings: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const settings = [
        { key: 'platform_name', value: platformName },
        { key: 'support_email', value: supportEmail },
        { key: 'support_phone', value: supportPhone },
        { key: 'company_whatsapp', value: companyWhatsApp },
        { key: 'use_company_contact', value: useCompanyContact.toString() },
        { key: 'maintenance_mode', value: maintenanceMode.toString() },
        { key: 'registration_open', value: registrationOpen.toString() },
        { key: 'property_approval_required', value: propertyApprovalRequired.toString() },
        { key: 'email_notifications', value: emailNotifications.toString() },
        { key: 'welcome_email', value: welcomeEmailEnabled.toString() },
        { key: 'inquiry_email', value: inquiryEmailEnabled.toString() },
      ];

      console.log('💾 Saving settings...', settings);

      for (const setting of settings) {
        const { error } = await supabase
          .from('platform_settings')
          .upsert(
            { key: setting.key, value: setting.value },
            { onConflict: 'key' }
          );

        if (error) {
          console.error('❌ Error saving setting:', setting.key, error);
          throw error;
        }
        console.log('✅ Saved:', setting.key);
      }

      toast({
        title: "Settings Saved",
        description: "Your changes have been saved successfully",
      });

      console.log('✅ All settings saved!');
    } catch (error: any) {
      console.error('💥 Error saving settings:', error);
      toast({
        title: "Error",
        description: `Failed to save: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">
            <Settings className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger value="features">
            <Building2 className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Information</CardTitle>
              <CardDescription>Basic platform details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="Enter platform name"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Control platform access and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-gray-600">Block all user access temporarily</p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">User Registration</Label>
                  <p className="text-sm text-gray-600">Allow new users to sign up</p>
                </div>
                <Switch
                  checked={registrationOpen}
                  onCheckedChange={setRegistrationOpen}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Property Approval</Label>
                  <p className="text-sm text-gray-600">Require admin approval before listing</p>
                </div>
                <Switch
                  checked={propertyApprovalRequired}
                  onCheckedChange={setPropertyApprovalRequired}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Contact</CardTitle>
              <CardDescription>Platform support information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    placeholder="+255 XXX XXX XXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company WhatsApp</CardTitle>
              <CardDescription>Override landlord contacts with company number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyWhatsApp">WhatsApp Number</Label>
                <Input
                  id="companyWhatsApp"
                  value={companyWhatsApp}
                  onChange={(e) => setCompanyWhatsApp(e.target.value)}
                  placeholder="+255 XXX XXX XXX"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div>
                  <Label className="text-base">Use Company Contact</Label>
                  <p className="text-sm text-gray-600">Show company number instead of landlord's</p>
                </div>
                <Switch
                  checked={useCompanyContact}
                  onCheckedChange={setUseCompanyContact}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Manage automated email alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Master toggle for all emails</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {emailNotifications && (
                <>
                  <div className="border-t pt-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Welcome Email</Label>
                        <p className="text-sm text-gray-600">Send to new users on signup</p>
                      </div>
                      <Switch
                        checked={welcomeEmailEnabled}
                        onCheckedChange={setWelcomeEmailEnabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Inquiry Notifications</Label>
                        <p className="text-sm text-gray-600">Notify landlords of new inquiries</p>
                      </div>
                      <Switch
                        checked={inquiryEmailEnabled}
                        onCheckedChange={setInquiryEmailEnabled}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button - Fixed at bottom */}
      <div className="flex justify-end sticky bottom-4">
        <Button onClick={handleSaveSettings} size="lg" disabled={isSaving} className="shadow-lg">
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
