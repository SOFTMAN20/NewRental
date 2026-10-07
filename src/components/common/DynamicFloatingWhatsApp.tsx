/**
 * DYNAMIC FLOATING WHATSAPP - READS SETTINGS FROM DATABASE
 * ========================================================
 * 
 * Wrapper for FloatingWhatsApp that fetches company WhatsApp number
 * from platform_settings in real-time
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import FloatingWhatsApp from './FloatingWhatsApp';

const DynamicFloatingWhatsApp = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('+255792072561'); // Default fallback
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch WhatsApp number from database
    const fetchWhatsAppNumber = async () => {
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .select('value')
          .eq('key', 'company_whatsapp')
          .single();

        if (!error && data?.value) {
          console.log('✅ WhatsApp number loaded from database:', data.value);
          setWhatsappNumber(data.value);
        } else {
          console.log('⚠️ Using default WhatsApp number');
        }
      } catch (error) {
        console.error('❌ Error fetching WhatsApp number:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhatsAppNumber();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('platform_settings_whatsapp')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_settings',
          filter: 'key=eq.company_whatsapp'
        },
        (payload) => {
          console.log('🔄 WhatsApp number updated in realtime:', payload);
          if (payload.new && 'value' in payload.new) {
            setWhatsappNumber((payload.new as any).value);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't render until we've checked the database
  if (isLoading) {
    return null;
  }

  return (
    <FloatingWhatsApp 
      phoneNumber={whatsappNumber}
      message="Habari! Nahitaji msaada kutafuta nyumba kwenye Wanachuo.com (Hello! I need help finding accommodation on Wanachuo.com)"
    />
  );
};

export default DynamicFloatingWhatsApp;
