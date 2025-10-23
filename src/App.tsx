import { useAuth } from "./hooks/useAuth";
import { Auth } from "./components/Auth";
import { Layout } from "./components/Layout";
import { HotelDashboard } from "./screens/hotel/HotelDashboard";
import { ElviraDashboard } from "./screens/elvira/ElviraDashboard";
import { elviraMenuItems } from "./utils/hotel/menuItems";

function App() {
  const { user, loading, signOut } = useAuth();
if (loading) {
return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
return <Auth />;
  }
// Show hotel dashboard for hotel users
  if (user.role === "hotel") {
return <HotelDashboard user={user} onSignOut={signOut} />;
  }

  // Show layout for elvira users
  if (user.role === "elvira") {
return (
      <Layout
        user={user}
        onSignOut={signOut}
        menuItems={elviraMenuItems}
        activeMenuItem="dashboard"
        collapsible={true}
      >
        <ElviraDashboard />
      </Layout>
    );
  }

  // Fallback for any other case
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Invalid user role</p>
        <button
          onClick={signOut}
          className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default App;
