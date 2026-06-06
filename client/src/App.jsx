import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProvidersPage from "./pages/ProvidersPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProviderDetailsPage from "./pages/ProviderDetailsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import ProviderBookingsPage from "./pages/ProviderBookingsPage";
import CompleteProviderProfilePage from "./pages/CompleteProviderProfilePage";
import EditProviderProfilePage from "./pages/EditProviderProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import IncomingCallManager from "./components/IncomingCallManager";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
       <IncomingCallManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/providers" element={<ProvidersPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/providers/:id" element={<ProviderDetailsPage />} />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider-bookings"
          element={
            <ProtectedRoute>
              <ProviderBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-provider-profile"
          element={
            <ProtectedRoute>
              <CompleteProviderProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-provider-profile"
          element={<EditProviderProfilePage />}
        />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
