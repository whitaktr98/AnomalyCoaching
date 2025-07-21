// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import HomePageWrapper from "./pages/HomePageWrapper";
import ClientsPage from "./pages/ClientsPage";
import AddClientPage from "./pages/AddClientPage";
import CoachLoginPage from "./pages/CoachLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientLoginPage from "./pages/ClientLoginPage";
import ClientLandingPage from "./pages/ClientLandingPage";
import ClientProtectedRoute from "./components/ClientProtectedRoute";
import PackagesPage from "./pages/PackagesPage";
import CreateWorkoutPlanPage from "./pages/CreateWorkoutPlanPage";
import AddAdminForm from "./components/AddAdminForm";
import PublicLandingPage from "./pages/PublicLandingPage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Landing/dashboard page for logged in users */}
         <Route path="/" element={<HomePageWrapper />} />
        {/* other routes unchanged */}
        
        
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ClientsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-coach"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddAdminForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/public-landing"
          element={
            
              <DashboardLayout>
                <PublicLandingPage />
              </DashboardLayout>
            
          }
        />

        <Route
          path="/add-client"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddClientPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-workout"
         element={
         <ProtectedRoute>
         <DashboardLayout>
        <CreateWorkoutPlanPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>

        {/* Client login page */}
        <Route path="/client-login" element={<ClientLoginPage />} />

        {/* Client dashboard */}
        <Route
          path="/client-dashboard"
          element={
            <ClientProtectedRoute>
              <ClientLandingPage />
            </ClientProtectedRoute>
          }
        />
        <Route
  path="/packages"
  element={
    
      <DashboardLayout>
        <PackagesPage />
      </DashboardLayout>
    
  }
/>

        {/* Coach login page */}
        <Route path="/coach-login" element={<CoachLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
