/**
 * USEFAVORITES.TSX - FAVORITES MANAGEMENT HOOK
 * ===========================================
 * 
 * Custom hook for managing user favorites/wishlist functionality
 * Hook maalum kwa kusimamia utendakazi wa vipendwa/orodha ya matakwa
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user's favorites
  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        return;
      }

      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if a property is favorited
  const isFavorited = (propertyId: string): boolean => {
    return favorites.some(fav => fav.property_id === propertyId);
  };

  // Add property to favorites
  const addToFavorites = async (propertyId: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Ingia kwanza",
        description: "Unahitaji kuingia ili kuweka nyumba kwenye vipendwa.",
        variant: "warning",
      });
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert([
          {
            user_id: user.id,
            property_id: propertyId
          }
        ])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Tayari imehifadhiwa",
            description: "Nyumba hii tayari imo kwenye vipendwa vyako.",
            variant: "warning",
          });
          return false;
        }
        throw error;
      }

      // Update local state
      setFavorites(prev => [data, ...prev]);
      
      toast({
        title: "Imehifadhiwa!",
        description: "Nyumba imehifadhiwa kwenye vipendwa vyako.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({
        title: "Hitilafu",
        description: "Imeshindikana kuhifadhi nyumba. Jaribu tena.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (propertyId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      // Update local state
      setFavorites(prev => prev.filter(fav => fav.property_id !== propertyId));
      
      toast({
        title: "Imeondolewa",
        description: "Nyumba imeondolewa kwenye vipendwa vyako.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({
        title: "Hitilafu",
        description: "Imeshindikana kuondoa nyumba. Jaribu tena.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string): Promise<boolean> => {
    if (isFavorited(propertyId)) {
      return await removeFromFavorites(propertyId);
    } else {
      return await addToFavorites(propertyId);
    }
  };

  // Get favorites count
  const getFavoritesCount = (): number => {
    return favorites.length;
  };

  // Fetch favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    isFavorited,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    getFavoritesCount,
    refetch: fetchFavorites
  };
};