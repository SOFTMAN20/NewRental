-- ============================================================================
-- UPDATE WHATSAPP NUMBER - Badilisha Namba ya WhatsApp
-- ============================================================================
-- Updates company WhatsApp number in platform_settings table
-- Run this in Supabase SQL Editor
-- ============================================================================

UPDATE platform_settings 
SET value = '+255722429317',
    updated_at = NOW()
WHERE key = 'company_whatsapp';

-- Verify the update
SELECT key, value, updated_at 
FROM platform_settings 
WHERE key = 'company_whatsapp';

-- ============================================================================
-- DONE! WhatsApp number updated to: +255722429317 (0722429317)
-- ============================================================================
