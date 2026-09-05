import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminManagement from "./pages/Admin/AdminManagement";
import OperatorManagement from "./pages/Operator/OperatorManagement";
import BankManagement from "./pages/Bank/BankManagement";
import OpeningBalance from "./pages/OpeningBalance/OpeningBalance";
import PhysicalCashOpening from "./pages/PhysicalCashOpening/PhysicalCashOpening";
import Transaction from "./pages/Transaction/Transaction";
import TransactionHistory from "./pages/TransactionHistory/TransactionHistory";
import CashClosing from "./pages/CashClosing/CashClosing";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={<Login />}
        />

        <Route
          path="/super-admin/admins"
          element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/operators"
          element={
            <ProtectedRoute>
              <OperatorManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/banks"
          element={
            <ProtectedRoute>
              <BankManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/opening-balance"
          element={
            <ProtectedRoute>
              <OpeningBalance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/physical-cash-opening"
          element={
            <ProtectedRoute>
              <PhysicalCashOpening />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/history"
          element={
            <ProtectedRoute>
              <TransactionHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/closing"
          element={
            <ProtectedRoute>
              <CashClosing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/operator/closing"
          element={
            <ProtectedRoute>
              <CashClosing />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;