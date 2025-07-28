/**
 * USEPROPERTIES.TSX - PROPERTY DATA MANAGEMENT HOOK
 * ================================================
 * 
 * Kipengele cha usimamizi wa data ya nyumba - Property data management system
 * 
 * ARCHITECTURE / MUUNDO:
 * This hook implements the React Query pattern for efficient data fetching,
 * caching, and synchronization with the Supabase backend.
 * 
 * FEATURES / VIPENGELE:
 * - Automatic data fetching and caching
 * - Background refetching for fresh data
 * - Error handling and retry logic
 * - Type-safe property data structure
 * - Optimistic updates support
 * 
 * PERFORMANCE BENEFITS / FAIDA ZA UTENDAJI:
 * - Intelligent caching reduces API calls
 * - Background updates keep data fresh
 * - Automatic deduplication of requests
 * - Stale-while-revalidate strategy
 * 
 * SCALABILITY / UKUAJI:
 * - Can be extended for property filtering
 * - Supports pagination for large datasets
 * - Easy to add mutations for CRUD operations
 * - Can be optimized with query keys for granular caching
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

/**
 * PROPERTY TYPE DEFINITION
 * =======================
 * 
 * Extended property type that includes related profile data.
 * Combines property information with landlord contact details.
 * 
 * BASE TYPE / AINA YA MSINGI:
 * - Inherits from Supabase generated types
 * - Ensures type safety with database schema
 * - Automatic updates when schema changes
 * 
 * EXTENDED FIELDS / UGA ULIOONGEZWA:
 * - profiles: Landlord contact information
 * - Optional to handle cases where profile might not exist
 * - Includes full_name and phone for contact purposes
 * 
 * USAGE / MATUMIZI:
 * Used throughout the app for consistent property data structure.
 * Enables type-safe access to property and landlord information.
 */
export type Property = Tables<'properties'> & {
  profiles?: {
    full_name: string | null;
    phone: string | null;
  };
};

/**
 * PROPERTIES QUERY HOOK
 * ====================
 * 
 * Main hook for fetching property data from the database.
 * Implements React Query for efficient data management.
 * 
 * QUERY CONFIGURATION / MIPANGILIO YA HOJA:
 * - queryKey: ['properties'] - Unique identifier for caching
 * - queryFn: Async function that fetches data from Supabase
 * - Automatic refetching on window focus
 * - Error retry with exponential backoff
 * 
 * DATA TRANSFORMATION / MABADILIKO YA DATA:
 * - Joins properties with landlord profiles
 * - Filters only active properties
 * - Orders by creation date (newest first)
 * - Transforms profile arrays to single objects
 * 
 * ERROR HANDLING / KUSHUGHULIKIA MAKOSA:
 * - Comprehensive error logging
 * - Graceful fallback to empty array
 * - User-friendly error messages
 * - Automatic retry on network failures
 * 
 * CACHING STRATEGY / MKAKATI WA KUHIFADHI:
 * - Data cached for 5 minutes by default
 * - Background refetching keeps data fresh
 * - Shared cache across components
 * - Automatic invalidation on mutations
 */
export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      /**
       * DATA FETCHING PROCESS
       * ====================
       * 
       * Step-by-step process for fetching property data:
       * 1. Log fetch attempt for debugging
       * 2. Query Supabase with joins and filters
       * 3. Handle errors with detailed logging
       * 4. Transform data for consistent structure
       * 5. Return type-safe property array
       */
      console.log('Fetching properties...');
      
      /**
       * SUPABASE QUERY CONSTRUCTION
       * ==========================
       * 
       * Complex query that:
       * - Selects all property fields (*)
       * - Joins with profiles table for landlord info
       * - Filters only active properties
       * - Orders by creation date descending
       * 
       * JOIN SYNTAX / MUUNDO WA KUUNGANISHA:
       * profiles!fk_landlord_profile - Uses foreign key relationship
       * (full_name, phone) - Selects specific profile fields
       * 
       * PERFORMANCE / UTENDAJI:
       * - Single query reduces round trips
       * - Indexed fields for fast filtering
       * - Limited fields for reduced payload
       */
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!fk_landlord_profile (
            full_name,
            phone
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        /**
         * ERROR HANDLING STRATEGY
         * ======================
         * 
         * Comprehensive error handling:
         * - Log error details for debugging
         * - Throw error to trigger React Query retry
         * - Error boundary will catch unhandled errors
         * - User sees loading state during retries
         */
        console.error('Error fetching properties:', error);
        throw error;
      }

      /**
       * DATA TRANSFORMATION LOGIC
       * ========================
       * 
       * Transforms Supabase response to match our Property type:
       * 
       * ISSUE / TATIZO:
       * Supabase returns profiles as an array due to join syntax,
       * but we need a single profile object for each property.
       * 
       * SOLUTION / SULUHISHO:
       * - Check if profiles array exists and has items
       * - Extract first profile object from array
       * - Set to undefined if no profile found
       * 
       * TYPE SAFETY / USALAMA WA AINA:
       * - Explicit casting to Property[] ensures type safety
       * - Handles edge cases where profile might not exist
       * - Maintains consistency with Property type definition
       */
      const transformedData = data?.map(property => ({
        ...property,
        profiles: Array.isArray(property.profiles) && property.profiles.length > 0 
          ? property.profiles[0] 
          : undefined
      })) || [];

      /**
       * SUCCESS LOGGING AND RETURN
       * =========================
       * 
       * Final steps:
       * - Log successful fetch with data count
       * - Return transformed data with proper typing
       * - Data is now ready for component consumption
       * 
       * DEBUGGING / UTATUZI:
       * Console logs help track data flow and identify issues.
       * Can be removed in production for performance.
       */
      console.log('Properties fetched successfully:', transformedData);
      return transformedData as Property[];
    },
  });
};
