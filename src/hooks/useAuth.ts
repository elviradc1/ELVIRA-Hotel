import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { authService } from "../services/auth";
import type { UserProfile } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("🔵 useAuth: Hook initialized", {
    hasUser: !!user,
    loading,
    localStorageKeys: Object.keys(localStorage).filter((k) =>
      k.includes("supabase")
    ),
  });

  useEffect(() => {
    console.log("🔵 useAuth: useEffect triggered - initializing auth");
    console.log(
      "🔵 useAuth: Local storage supabase data:",
      Object.keys(localStorage)
        .filter((key) => key.includes("supabase"))
        .map((key) => ({ key, hasValue: !!localStorage.getItem(key) }))
    );

    // Get initial session and profile
    const initializeAuth = async () => {
      console.log("🔵 useAuth: Getting initial session...");

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("🔵 useAuth: Initial session result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          email: session?.user?.email,
        });

        if (session?.user) {
          console.log("🔵 useAuth: Session found, fetching user profile...");
          const profile = await authService.getUserProfile(session.user.id);
          console.log("🔵 useAuth: Profile result:", profile);

          if (!profile) {
            console.log(
              "🔴 useAuth: No profile found for session user, clearing session"
            );
            // If profile doesn't exist, the session is invalid
            await supabase.auth.signOut();
            setUser(null);
          } else {
            console.log("🟢 useAuth: Valid profile found, setting user");
            setUser(profile);
          }
        } else {
          console.log("🔵 useAuth: No session found, setting user to null");
          setUser(null);
        }
      } catch (error) {
        console.error("🔴 useAuth: Error during initialization:", error);
        setUser(null);
      }

      console.log("🔵 useAuth: Setting loading to false");
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🟡 useAuth: Auth state changed:", {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
      });

      try {
        if (session?.user) {
          console.log(
            "🟡 useAuth: Auth change - fetching profile for user:",
            session.user.id
          );
          const profile = await authService.getUserProfile(session.user.id);
          console.log("🟡 useAuth: Auth change - profile result:", profile);

          if (!profile) {
            console.log(
              "🔴 useAuth: Auth change - no profile found, signing out"
            );
            // If profile doesn't exist, sign out
            await supabase.auth.signOut();
            setUser(null);
          } else {
            console.log("🟢 useAuth: Auth change - valid profile found");
            setUser(profile);
          }
        } else {
          console.log(
            "🟡 useAuth: Auth change - no session, setting user to null"
          );
          setUser(null);
        }
      } catch (error) {
        console.error("🔴 useAuth: Error during auth state change:", error);
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      console.log("🔵 useAuth: Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("🔵 useAuth: signIn called for:", email);

    try {
      const { data, error } = await authService.signIn(email, password);

      console.log("🔵 useAuth: signIn authService result:", {
        hasData: !!data,
        hasUser: !!data.user,
        hasError: !!error,
        error: error?.message,
      });

      if (data.user && !error) {
        console.log("🔵 useAuth: User signed in, fetching profile...");
        const profile = await authService.getUserProfile(data.user.id);

        if (!profile) {
          console.log("🔴 useAuth: No profile found, signing out user");
          // If no profile found, sign out the user
          await authService.signOut();
          return {
            data: null,
            error: {
              message: "No profile found. Please contact administrator.",
            },
          };
        }

        console.log("🔵 useAuth: Profile found, checking role:", profile.role);
        // Check if user has valid role
        if (profile.role !== "elvira" && profile.role !== "hotel") {
          console.log("🔴 useAuth: Invalid role, signing out user");
          await authService.signOut();
          return {
            data: null,
            error: { message: "Invalid user role. Access denied." },
          };
        }

        console.log("🟢 useAuth: Sign in successful with valid role");
      }

      return { data, error };
    } catch (error) {
      console.error("🔴 useAuth: Exception during signIn:", error);
      return {
        data: null,
        error: { message: "An unexpected error occurred during sign in" },
      };
    }
  };

  const signOut = async () => {
    console.log("🔵 useAuth: signOut called");

    try {
      // Clear user state immediately
      setUser(null);

      // Sign out from Supabase
      const { error } = await authService.signOut();

      if (error) {
        console.error("🔴 useAuth: Error during signOut:", error);
      } else {
        console.log("🟢 useAuth: Successfully signed out");
      }

      // Clear all local storage data related to Supabase
      const supabaseKeys = Object.keys(localStorage).filter(
        (key) => key.includes("supabase") || key.includes("auth")
      );

      supabaseKeys.forEach((key) => {
        localStorage.removeItem(key);
        console.log(`🔵 useAuth: Cleared localStorage key: ${key}`);
      });

      // Also clear session storage
      const sessionSupabaseKeys = Object.keys(sessionStorage).filter(
        (key) => key.includes("supabase") || key.includes("auth")
      );

      sessionSupabaseKeys.forEach((key) => {
        sessionStorage.removeItem(key);
        console.log(`🔵 useAuth: Cleared sessionStorage key: ${key}`);
      });

      return { error };
    } catch (error) {
      console.error("🔴 useAuth: Exception during signOut:", error);
      // Clear user state even if there's an error
      setUser(null);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    return { error };
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    resetPassword,
  };
}
