import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import VerifyOtp from "./components/VerifyOtp";
import AuthProtectedRoute from "./components/authProtected";
import Analytics from "./pages/Analytics";
import Invoice from "./pages/Invoice";
import Subscription from "./pages/Subscription";

import CLients from "./pages/CLients";
import Biller from "./pages/Biller";
import CreateInvoice from "./pages/Invoices";
import AllInvoices from "./pages/AllInvoice";

const App = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthProtectedRoute>
              <Home />
            </AuthProtectedRoute>
          }
        >
          <Route index element={<Navigate to="analytics" replace />} />
          <Route
            path="analytics"
            element={
              <AuthProtectedRoute>
                <Analytics />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <AuthProtectedRoute>
                <CLients />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="invoice"
            element={
              <AuthProtectedRoute>
                <CreateInvoice/>
              </AuthProtectedRoute>
            }
          />
           <Route
            path="allinvoice"
            element={
              <AuthProtectedRoute>
                <AllInvoices/>
              </AuthProtectedRoute>
            }
          />
          <Route
            path="biller"
            element={
              <AuthProtectedRoute>
                <Biller />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="invoice"
            element={
              <AuthProtectedRoute>
                <Invoice />
              </AuthProtectedRoute>
            }
          />
          <Route
            path="subscription"
            element={
              <AuthProtectedRoute>
                <Subscription />
              </AuthProtectedRoute>
            }
          />
        </Route>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/verify-otp"
          element={
            <ProtectedRoute>
              <VerifyOtp />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            style: {
              background: "#333",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#ff3333",
              color: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default App;
