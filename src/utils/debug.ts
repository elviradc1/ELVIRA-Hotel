// Debug utilities to help troubleshoot authentication issues

export const debugAuth = {
  // Check local storage for Supabase data
  checkLocalStorage() {
    console.log("🔍 Debug: Checking localStorage for Supabase data");

    const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );

    console.log("🔍 Debug: Found keys:", supabaseKeys);

    supabaseKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        console.log(`🔍 Debug: ${key}:`, value ? JSON.parse(value) : null);
      } catch {
        console.log(`🔍 Debug: ${key}:`, localStorage.getItem(key));
      }
    });
  },

  // Check environment variables
  checkEnvVars() {
    console.log("🔍 Debug: Checking environment variables");
    console.log(
      "🔍 Debug: VITE_SUPABASE_URL:",
      import.meta.env.VITE_SUPABASE_URL ? "SET" : "NOT SET"
    );
    console.log(
      "🔍 Debug: VITE_SUPABASE_ANON_KEY:",
      import.meta.env.VITE_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
    );
  },

  // Check network connectivity to Supabase
  async checkConnectivity() {
    console.log("🔍 Debug: Checking Supabase connectivity");

    const url = import.meta.env.VITE_SUPABASE_URL;
    if (!url) {
      console.error("🔍 Debug: No Supabase URL found");
      return;
    }

    try {
      const response = await fetch(`${url}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      });

      console.log("🔍 Debug: Supabase connectivity:", {
        status: response.status,
        ok: response.ok,
      });
    } catch (error) {
      console.error("🔍 Debug: Connectivity error:", error);
    }
  },

  // Clear all auth data
  clearAuthData() {
    console.log("🔍 Debug: Clearing all auth data");

    const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );

    supabaseKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🔍 Debug: Removed ${key}`);
    });

    // Also clear session storage
    const sessionSupabaseKeys = Object.keys(sessionStorage).filter(
      (key) => key.includes("supabase") || key.includes("auth")
    );

    sessionSupabaseKeys.forEach((key) => {
      sessionStorage.removeItem(key);
      console.log(`🔍 Debug: Removed from session storage ${key}`);
    });

    console.log("🔍 Debug: All auth data cleared");
  },

  // Force sign out and clear everything
  async forceSignOut() {
    console.log("🔍 Debug: Force signing out and clearing all data");

    try {
      // Import supabase dynamically to avoid circular imports
      const { supabase } = await import("../services/supabase");

      // Sign out from Supabase
      await supabase.auth.signOut();
      console.log("🔍 Debug: Supabase signOut completed");

      // Clear all storage
      this.clearAuthData();

      // Reload the page to reset everything
      window.location.reload();
    } catch (error) {
      console.error("🔍 Debug: Error during force sign out:", error);
      // Clear storage anyway
      this.clearAuthData();
      window.location.reload();
    }
  },

  // Run all checks
  runAllChecks() {
    console.log("🔍 Debug: Running all authentication checks");
    this.checkEnvVars();
    this.checkLocalStorage();
    this.checkConnectivity();
  },

  // Check if there's a persisting session issue
  checkSessionIssue() {
    console.log("🔍 Debug: Checking for session persistence issues");

    const supabaseKeys = Object.keys(localStorage).filter((key) =>
      key.includes("supabase")
    );

    console.log("🔍 Debug: Found Supabase localStorage keys:", supabaseKeys);

    supabaseKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);
          console.log(`🔍 Debug: ${key}:`, parsed);

          // Check for access_token or user data
          if (parsed.access_token || parsed.user) {
            console.log("⚠️ Debug: Found persisting session data in:", key);
          }
        }
      } catch {
        console.log(`🔍 Debug: ${key}:`, localStorage.getItem(key));
      }
    });
  },
};

// Make it available globally for debugging in browser console
declare global {
  interface Window {
    debugAuth: typeof debugAuth;
  }
}

window.debugAuth = debugAuth;
