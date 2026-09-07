import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/ToastContainer";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./pages/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminManagement from "./pages/Admin/AdminManagement";
import OperatorManagement from "./pages/Operator/OperatorManagement";
import BankManagement from "./pages/Bank/BankManagement";
import OpeningBalance from "./pages/OpeningBalance/OpeningBalance";
import PhysicalCashOpening from "./pages/PhysicalCashOpening/PhysicalCashOpening";
import Transaction from "./pages/Transaction/Transaction";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory";
import CashClosing from "./pages/CashClosing/CashClosing";
import CashClosingHistory from "./pages/CashClosing/CashClosingHistory";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Authenticated Banking Routes wrapped in AppLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin/admins"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/operators"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OperatorManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/banks"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BankManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/opening-balance"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OpeningBalance />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/opening-balance"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OpeningBalance />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/physical-cash-opening"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PhysicalCashOpening />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/physical-cash-opening"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PhysicalCashOpening />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Transaction Routes */}
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Transaction />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/transactions"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Transaction />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* History Routes */}
          <Route
            path="/admin/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TransactionHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TransactionHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Closing Routes */}
          <Route
            path="/admin/closing"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CashClosing />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/closing"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CashClosing />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Closing History Routes */}
          <Route
            path="/admin/closing-history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CashClosingHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/operator/closing-history"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CashClosingHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;