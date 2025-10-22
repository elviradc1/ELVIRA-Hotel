import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { authService } from "../services/auth";
import type { UserProfile } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("🔵 useAuth: Hook initialized, loading:", loading, "user:", user);

  useEffect(() => {
    console.log("🔵 useAuth: useEffect running - checking session");

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log("🔵 useAuth: getSession result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
        });

        if (session?.user) {
          console.log(
            "🔵 useAuth: Fetching user profile for:",
            session.user.id
          );
          authService
            .getUserProfile(session.user.id)
            .then((profile) => {
              console.log("🔵 useAuth: Got user profile:", profile);
              setUser(profile);
              setLoading(false);
              console.log("🔵 useAuth: Loading set to false");
            })
            .catch((error) => {
              console.error("🔴 useAuth: Error fetching user profile:", error);
              setLoading(false);
            });
        } else {
          console.log("🔵 useAuth: No session found, loading set to false");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("🔴 useAuth: Error getting session:", error);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(
        "🔵 useAuth: Auth state changed:",
        event,
        "hasSession:",
        !!session
      );

      if (event === "SIGNED_IN" && session?.user) {
        console.log("🔵 useAuth: User signed in, fetching profile");
        authService
          .getUserProfile(session.user.id)
          .then((profile) => {
            console.log("🔵 useAuth: Profile fetched after sign in:", profile);
            setUser(profile);
          })
          .catch((error) => {
            console.error(
              "🔴 useAuth: Error fetching profile after sign in:",
              error
            );
          });
      } else if (event === "SIGNED_OUT") {
        console.log("🔵 useAuth: User signed out");
        setUser(null);
      }
    });

    return () => {
      console.log("🔵 useAuth: Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);

    if (error) {
      return { data: null, error };
    }

    if (data.user) {
      const profile = await authService.getUserProfile(data.user.id);

      if (!profile) {
        await authService.signOut();
        return {
          data: null,
          error: { message: "No profile found. Please contact administrator." },
        };
      }

      if (profile.role !== "elvira" && profile.role !== "hotel") {
        await authService.signOut();
        return {
          data: null,
          error: { message: "Invalid user role. Access denied." },
        };
      }
    }

    return { data, error };
  };

  const signOut = async () => {
    setUser(null);
    const { error } = await authService.signOut();
    return { error };
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
