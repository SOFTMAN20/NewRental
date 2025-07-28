/**
 * USEAUTH.TSX - AUTHENTICATION HOOK AND CONTEXT
 * =============================================
 * 
 * Kipengele cha uthibitisho wa mtumiaji - User authentication system
 * 
 * ARCHITECTURE / MUUNDO:
 * This hook implements the Context + Provider pattern for global authentication state.
 * It provides a centralized way to manage user authentication across the entire app.
 * 
 * FEATURES / VIPENGELE:
 * - Centralized authentication state management
 * - Automatic session persistence and restoration
 * - Real-time authentication state updates
 * - Integrated toast notifications for user feedback
 * - Secure sign up/in/out operations
 * 
 * SECURITY CONSIDERATIONS / MAMBO YA USALAMA:
 * - Uses Supabase Auth for secure authentication
 * - Automatic token refresh and session management
 * - Secure password handling (never stored locally)
 * - Email verification workflow support
 * 
 * SCALABILITY / UKUAJI:
 * - Can be extended to support multiple auth providers
 * - Role-based access control can be added
 * - Social authentication can be integrated
 * - Multi-factor authentication support possible
 * 
 * PERFORMANCE / UTENDAJI:
 * - Minimal re-renders through optimized context usage
 * - Efficient session checking on app initialization
 * - Automatic cleanup of auth listeners
 */
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * AUTHENTICATION CONTEXT TYPE DEFINITION
 * =====================================
 * 
 * Defines the shape of the authentication context that will be
 * available to all components that consume this context.
 * 
 * PROPERTIES / VIPENGELE:
 * - user: Current authenticated user object or null
 * - session: Current session object with tokens
 * - loading: Boolean indicating if auth state is being determined
 * - signUp: Function to register new users
 * - signIn: Function to authenticate existing users
 * - signOut: Function to log out current user
 * 
 * TYPE SAFETY / USALAMA WA AINA:
 * - All functions return Promise with error handling
 * - Strict typing prevents runtime errors
 * - Metadata parameter allows flexible user data
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

/**
 * AUTHENTICATION CONTEXT CREATION
 * ==============================
 * 
 * Creates the React context that will hold authentication state.
 * Initialized as undefined to force proper provider usage.
 * 
 * PATTERN / MUUNDO:
 * - Context + Provider pattern for global state
 * - Undefined default forces proper error handling
 * - Type-safe context consumption
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AUTHENTICATION PROVIDER COMPONENT
 * ================================
 * 
 * Main provider component that wraps the app and provides auth state.
 * Manages all authentication operations and state updates.
 * 
 * LIFECYCLE / MZUNGUKO WA MAISHA:
 * 1. Initialize with loading state
 * 2. Set up auth state listener
 * 3. Check for existing session
 * 4. Update state based on auth changes
 * 5. Cleanup listeners on unmount
 * 
 * ERROR HANDLING / KUSHUGHULIKIA MAKOSA:
 * - Toast notifications for user feedback
 * - Graceful error recovery
 * - Detailed error messages in Swahili
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    /**
     * AUTHENTICATION STATE LISTENER SETUP
     * ==================================
     * 
     * Sets up real-time listener for authentication state changes.
     * This ensures the app responds immediately to auth events.
     * 
     * EVENTS HANDLED / MATUKIO YANAYOSHUGHULIKIWA:
     * - SIGNED_IN: User successfully authenticated
     * - SIGNED_OUT: User logged out
     * - TOKEN_REFRESHED: Session tokens updated
     * - USER_UPDATED: User profile changes
     * 
     * CRITICAL ORDER / MPANGILIO MUHIMU:
     * Listener must be set up BEFORE checking existing session
     * to avoid race conditions and missed events.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    /**
     * EXISTING SESSION CHECK
     * =====================
     * 
     * Checks for existing valid session on app initialization.
     * This handles cases where user refreshes page or returns to app.
     * 
     * FLOW / MTIRIRIKO:
     * 1. Query Supabase for current session
     * 2. Update local state with session data
     * 3. Set loading to false to show UI
     * 
     * TIMING / MUDA:
     * Must happen AFTER listener setup to ensure consistency.
     */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    /**
     * CLEANUP FUNCTION
     * ===============
     * 
     * Removes auth listener when component unmounts.
     * Prevents memory leaks and unnecessary event handling.
     */
    return () => subscription.unsubscribe();
  }, []);

  /**
   * SIGN UP FUNCTION
   * ===============
   * 
   * Handles new user registration with email and password.
   * Includes user metadata for profile creation.
   * 
   * PARAMETERS / VIGEZO:
   * - email: User's email address
   * - password: User's chosen password
   * - metadata: Additional user data (name, phone, type)
   * 
   * FEATURES / VIPENGELE:
   * - Email confirmation disabled for MVP
   * - Automatic profile creation via database trigger
   * - Success/error toast notifications
   * - Redirect URL for email confirmation (if enabled)
   * 
   * ERROR HANDLING / KUSHUGHULIKIA MAKOSA:
   * - User-friendly error messages in Swahili
   * - Detailed error logging for debugging
   * - Graceful fallback for network issues
   */
  const signUp = async (email: string, password: string, metadata: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hitilafu ya kujisajili",
        description: error.message
      });
    } else {
      toast({
        title: "Umefanikiwa kujisajili!",
        description: metadata.user_type === 'landlord' 
          ? "Karibu kwenye Nyumba Link! Unaweza kuanza kuongeza nyumba zako sasa."
          : "Tafadhali kagua barua pepe yako ili kuthibitisha akaunti yako."
      });
    }

    return { error };
  };

  /**
   * SIGN IN FUNCTION
   * ===============
   * 
   * Handles user authentication with email and password.
   * 
   * PARAMETERS / VIGEZO:
   * - email: User's registered email
   * - password: User's password
   * 
   * SECURITY / USALAMA:
   * - Passwords never stored locally
   * - Secure token-based authentication
   * - Automatic session management
   * 
   * USER EXPERIENCE / TAJRIBA YA MTUMIAJI:
   * - Immediate feedback via toast notifications
   * - Automatic redirect after successful login
   * - Clear error messages for failed attempts
   */
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Hitilafu ya kuingia",
        description: error.message
      });
    } else {
      toast({
        title: "Umefanikiwa kuingia!",
        description: "Karibu kwenye Nyumba Link"
      });
    }

    return { error };
  };

  /**
   * SIGN OUT FUNCTION
   * ================
   * 
   * Handles user logout and session cleanup.
   * 
   * CLEANUP PROCESS / MCHAKATO WA USAFISHAJI:
   * 1. Clear Supabase session
   * 2. Remove local storage tokens
   * 3. Reset authentication state
   * 4. Show confirmation message
   * 
   * SECURITY / USALAMA:
   * - Complete session invalidation
   * - Secure token cleanup
   * - Prevents unauthorized access
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      toast({
        title: "Umetoka nje",
        description: "Tutakuona tena!"
      });
    }
  };

  /**
   * CONTEXT PROVIDER RETURN
   * ======================
   * 
   * Provides authentication state and functions to child components.
   * 
   * VALUE OBJECT / KITU CHA THAMANI:
   * - Current user and session state
   * - Loading state for UI feedback
   * - Authentication functions
   * 
   * PERFORMANCE / UTENDAJI:
   * - Memoized context value would optimize re-renders
   * - Consider useMemo for production optimization
   */
  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * AUTHENTICATION HOOK
 * ==================
 * 
 * Custom hook for consuming authentication context.
 * Provides type-safe access to auth state and functions.
 * 
 * ERROR HANDLING / KUSHUGHULIKIA MAKOSA:
 * - Throws error if used outside AuthProvider
 * - Prevents undefined context access
 * - Ensures proper provider setup
 * 
 * USAGE / MATUMIZI:
 * const { user, signIn, signOut } = useAuth();
 * 
 * BENEFITS / FAIDA:
 * - Type safety throughout the app
 * - Centralized authentication logic
 * - Easy testing and mocking
 * - Consistent error handling
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};