/**
 * ADMINSETTINGS.TSX - ADMIN SETTINGS COMPONENT
 * ============================================
 * 
 * Platform configuration and system settings
 */

import { useState, useEffect } from "react";
import { supabase } from "@/lib/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Save,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const AdminSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

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
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        
        // If table doesn't exist or no data, just use defaults
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.warn('⚠️ platform_settings table not found or empty. Using default values.');
          console.log('💡 Run FIX_PLATFORM_SETTINGS.sql to create the table.');
          setIsLoading(false);
          return;
        }
        
        throw error;
      }

      console.log('✅ Settings fetched:', data?.length || 0, 'settings');

      // Map settings to state
      data?.forEach(setting => {
        console.log('Setting:', setting.key, '=', setting.value);
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
        title: "Hitilafu / Error",
        description: `Imeshindwa kupata mipangilio / Failed to fetch settings: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
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

      // Use UPSERT (insert or update) for all settings
      for (const setting of settings) {
        const { error } = await supabase
          .from('platform_settings')
          .upsert(
            { key: setting.key, value: setting.value },
            { onConflict: 'key' }  // Update if key exists, insert if not
          );

        if (error) {
          console.error('❌ Error saving setting:', setting.key, error);
          throw error;
        }
        console.log('✅ Saved:', setting.key);
      }

      toast({
        title: "Mipangilio Imehifadhiwa / Settings Saved",
        description: "Mabadiliko yako yamehifadhiwa / Your changes have been saved successfully",
      });

      console.log('✅ All settings saved successfully!');
    } catch (error: any) {
      console.error('💥 Error saving settings:', error);
      toast({
        title: "Hitilafu / Error",
        description: `Imeshindwa kuhifadhi / Failed to save settings: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Mipangilio ya Jukwaa / Platform Settings
          </CardTitle>
          <CardDescription>
            Rekebisha mipangilio ya kimsingi ya jukwaa
            <br />
            Configure basic platform settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platformName">
              Jina la Jukwaa / Platform Name
            </Label>
            <Input
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="supportEmail">
                Barua Pepe ya Msaada / Support Email
              </Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportPhone">
                Simu ya Msaada / Support Phone
              </Label>
              <Input
                id="supportPhone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyWhatsApp">
              WhatsApp ya Kampuni / Company WhatsApp
            </Label>
            <Input
              id="companyWhatsApp"
              value={companyWhatsApp}
              onChange={(e) => setCompanyWhatsApp(e.target.value)}
              placeholder="+255 XXX XXX XXX"
            />
            <p className="text-xs text-muted-foreground">
              Namba hii itaonyeshwa kwenye mali badala ya namba ya mwenye nyumba
              <br />
              This number will be shown on properties instead of landlord's number
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
              <div className="space-y-0.5 flex-1">
                <Label htmlFor="useCompanyContact" className="cursor-pointer">
                  Tumia Mawasiliano ya Kampuni / Use Company Contact
                </Label>
                <p className="text-sm text-muted-foreground">
                  Onyesha namba ya kampuni badala ya namba ya mwenye nyumba kwenye mali zote
                  <br />
                  Show company contact instead of landlord contact on all properties
                </p>
              </div>
              <div className="ml-4">
                <Switch
                  id="useCompanyContact"
                  checked={useCompanyContact}
                  onCheckedChange={(checked) => {
                    console.log('🔘 Toggle clicked:', checked);
                    setUseCompanyContact(checked);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Hali ya Matengenezo / Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Zuia watumiaji wote kuingia / Block all user access
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Usajili Umefunguliwa / Registration Open</Label>
                <p className="text-sm text-muted-foreground">
                  Ruhusu watumiaji wapya kusajili / Allow new user registration
                </p>
              </div>
              <Switch
                checked={registrationOpen}
                onCheckedChange={setRegistrationOpen}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Idhini ya Mali / Property Approval Required</Label>
                <p className="text-sm text-muted-foreground">
                  Mali zote zinahitaji idhini kabla ya kuchapishwa / All properties require admin approval
                </p>
              </div>
              <Switch
                checked={propertyApprovalRequired}
                onCheckedChange={setPropertyApprovalRequired}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Mipangilio ya Barua Pepe / Email Settings
          </CardTitle>
          <CardDescription>
            Dhibiti arifa za barua pepe
            <br />
            Manage email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Arifa za Barua Pepe / Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Washa au zima arifa zote / Enable or disable all email notifications
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          {emailNotifications && (
            <>
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Barua Pepe ya Karibu / Welcome Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Tuma barua pepe kwa watumiaji wapya / Send email to new users
                  </p>
                </div>
                <Switch
                  checked={welcomeEmailEnabled}
                  onCheckedChange={setWelcomeEmailEnabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Arifa za Maswali / Inquiry Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Arifu wenye nyumba kuhusu maswali mapya / Notify landlords about inquiries
                  </p>
                </div>
                <Switch
                  checked={inquiryEmailEnabled}
                  onCheckedChange={setInquiryEmailEnabled}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Database Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Usimamizi wa Database / Database Management
          </CardTitle>
          <CardDescription>
            Shughuli za database na uhifadhi / Database operations and backup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Fanya Backup / Create Backup
            </Button>
            <Button variant="outline" className="w-full">
              <Database className="mr-2 h-4 w-4" />
              Rejesha Backup / Restore Backup
            </Button>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Onyo / Warning:</strong> Shughuli za database zinaweza kuathiri utendaji wa jukwaa. Tumia kwa hadhari.
              <br />
              Database operations may affect platform performance. Use with caution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Mipangilio ya Usalama / Security Settings
          </CardTitle>
          <CardDescription>
            Dhibiti usalama wa jukwaa / Manage platform security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">
              Muda wa Session (dakika) / Session Timeout (minutes)
            </Label>
            <Input
              id="sessionTimeout"
              type="number"
              defaultValue="60"
              min="15"
              max="1440"
            />
            <p className="text-xs text-muted-foreground">
              Muda kabla session inatoka / Time before automatic logout
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLoginAttempts">
              Majaribio ya Kuingia / Max Login Attempts
            </Label>
            <Input
              id="maxLoginAttempts"
              type="number"
              defaultValue="5"
              min="3"
              max="10"
            />
            <p className="text-xs text-muted-foreground">
              Majaribio ya kuingia kabla akaunti kuzuiwa / Attempts before account lockout
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO and Localization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO na Lugha / SEO and Localization
          </CardTitle>
          <CardDescription>
            Mipangilio ya injini za utafutaji na lugha / Search engine and language settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">
              Kichwa cha Tovuti / Site Title
            </Label>
            <Input
              id="siteTitle"
              defaultValue="Nyumba Link - Tanzania Housing Platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">
              Maelezo ya Tovuti / Site Description
            </Label>
            <Textarea
              id="siteDescription"
              rows={3}
              defaultValue="Pata nyumba za wanafunzi karibu na chuo chako. Jukwaa la nyumba Tanzania."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLanguage">
              Lugha ya Msingi / Default Language
            </Label>
            <Input
              id="defaultLanguage"
              defaultValue="sw-TZ (Swahili - Tanzania)"
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Lugha kuu ya jukwaa / Primary platform language
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Hifadhi Mabadiliko / Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
