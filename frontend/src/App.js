import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes, Navigate, Router } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signin from "./pages/auth/Signin";
import { UserProvider } from "./context/UserContext";
import AdminDashbaord from "./pages/admin/AdminDashbaord";
import EditAdmin from "./components/admin/EditAdmin";
import ApproveAdmin from "./components/admin/ApproveAdmin";

// Protected Route Component
function ProtectedRoute({ children }) {
  const tenantId = localStorage.getItem("tenantId");
  if (!tenantId) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Routes - No Navbar */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashbaord />
                </ProtectedRoute>
              }
            />
            <Route path="/edit/:tenantId/:userId" element={<EditAdmin />} />
            <Route path="/approve/:tenantId/:userId" element={<ApproveAdmin />} />

            {/* User Routes with Navbar */}
            <Route
              path="/*"
              element={
                <div className="flex flex-row">

                  {/* Routing components on the right */}
                  <div className="flex-1">
                    <div className="absolute top-0 left-0 w-full h-full -z-10">
                      <img src="gradient.svg" alt="" />
                    </div>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signin />} />

                      {/* Protected Routes */}
                      
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>
        </BrowserRouter>
      </UserProvider>
      <Toaster />
    </>
  );
}


export default App;
