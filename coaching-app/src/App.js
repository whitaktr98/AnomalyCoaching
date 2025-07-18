import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
// App.js (imports)
import HomePage from "./pages/HomePage";
import ClientsPage from "./pages/ClientsPage";
import AddClientPage from "./pages/AddClientPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AddAdminPage from "./pages/AddAdminPage";
import ClientLoginPage from "./pages/ClientLoginPage";
import ClientDashboard from "./pages/ClientDashboard";
import AddClientForm from "./components/AddClientForm";
import ClientLandingPage from "./pages/ClientLandingPage";
import ClientProtectedRoute from "./components/ClientProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <HomePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
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
  path="/client-dashboard"
  element={
    <ClientProtectedRoute>
      <ClientLandingPage />
    </ClientProtectedRoute>
  }
/>
          <Route
    path="/client-dashboard"
    element={
      <ClientProtectedRoute>
        <ClientDashboard />
      </ClientProtectedRoute>
    }
  />
    <Route
  path="/add-client"
  element={
    <ProtectedRoute>
      <AddClientForm />
    </ProtectedRoute>
  }
/>
        <Route 
        path="/client-login" 
        element={
        <ClientLoginPage />
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
  path="/add-admin"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <AddAdminPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
