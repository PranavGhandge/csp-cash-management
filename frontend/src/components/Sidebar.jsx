import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Landmark,
    Wallet,
    Coins,
    ArrowLeftRight,
    Lock,
    History,
    FileSpreadsheet,
    LogOut,
    ShieldCheck,
    ChevronDown,
    AlertTriangle,
    X
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import "./Sidebar.css";

const Sidebar = ({ onCloseMobile }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const role = user?.role;

    const isCashActive = [
        "/admin/opening-balance",
        "/operator/opening-balance",
        "/admin/physical-cash-opening",
        "/operator/physical-cash-opening"
    ].some(path => location.pathname === path);

    const isTransactionActive = [
        "/admin/transactions",
        "/operator/transactions",
        "/admin/closing",
        "/operator/closing"
    ].some(path => location.pathname === path);

    const isHistoryActive = [
        "/admin/history",
        "/operator/history",
        "/admin/closing-history",
        "/operator/closing-history"
    ].some(path => location.pathname === path);

    const isManagementActive = [
        "/admin/operators",
        "/admin/banks"
    ].some(path => location.pathname === path);

    const [openMenus, setOpenMenus] = useState({
        cash: isCashActive,
        transaction: isTransactionActive,
        history: isHistoryActive,
        management: isManagementActive
    });

    // Auto-open active dropdown on navigation
    useEffect(() => {
        if (isCashActive) setOpenMenus(prev => ({ ...prev, cash: true }));
        if (isTransactionActive) setOpenMenus(prev => ({ ...prev, transaction: true }));
        if (isHistoryActive) setOpenMenus(prev => ({ ...prev, history: true }));
        if (isManagementActive) setOpenMenus(prev => ({ ...prev, management: true }));
    }, [location.pathname, isCashActive, isTransactionActive, isHistoryActive, isManagementActive]);

    const toggleMenu = (key) => {
        setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName[0].toUpperCase() : "P";
        const last = lastName ? lastName[0].toUpperCase() : "G";
        return `${first}${last}`;
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowLogoutModal(false);
        if (toast && toast.success) {
            toast.success("Logged out successfully");
        }
        navigate("/login");
    };

    return (
        <>
            <aside className="bank-sidebar">
                {/* Header / Brand */}
                <div className="sidebar-brand">
                    <div className="brand-icon-wrap">
                        <Wallet size={21} strokeWidth={2.2} />
                    </div>
                    <div className="brand-details">
                        <h2 className="brand-title">CSP Portal</h2>
                        <div className="brand-pill">
                            <span className="brand-live-dot" />
                            <span>CASH FLOW PRO</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav-container">
                    <div className="nav-section-title">MAIN</div>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `nav-link-item ${isActive ? "active" : ""}`
                        }
                        onClick={onCloseMobile}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* CASH DROPDOWN */}
                    <div className="nav-dropdown-wrapper">
                        <button
                            type="button"
                            className={`nav-dropdown-btn ${isCashActive ? "parent-active" : ""} ${openMenus.cash ? "open" : ""}`}
                            onClick={() => toggleMenu("cash")}
                        >
                            <div className="nav-btn-content">
                                <Coins size={18} />
                                <span>Cash</span>
                            </div>
                            <ChevronDown size={15} className="nav-chevron" />
                        </button>

                        {openMenus.cash && (
                            <div className="nav-submenu">
                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/opening-balance" : "/admin/opening-balance"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <Wallet size={15} />
                                    <span>Opening Cash</span>
                                </NavLink>

                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/physical-cash-opening" : "/admin/physical-cash-opening"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <Coins size={15} />
                                    <span>Physical Cash</span>
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* TRANSACTION DROPDOWN */}
                    <div className="nav-dropdown-wrapper">
                        <button
                            type="button"
                            className={`nav-dropdown-btn ${isTransactionActive ? "parent-active" : ""} ${openMenus.transaction ? "open" : ""}`}
                            onClick={() => toggleMenu("transaction")}
                        >
                            <div className="nav-btn-content">
                                <ArrowLeftRight size={18} />
                                <span>Transaction</span>
                            </div>
                            <ChevronDown size={15} className="nav-chevron" />
                        </button>

                        {openMenus.transaction && (
                            <div className="nav-submenu">
                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/transactions" : "/admin/transactions"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <ArrowLeftRight size={15} />
                                    <span>Create Transaction</span>
                                </NavLink>

                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/closing" : "/admin/closing"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <Lock size={15} />
                                    <span>Cash Closing</span>
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* TRANSACTION HISTORY DROPDOWN */}
                    <div className="nav-dropdown-wrapper">
                        <button
                            type="button"
                            className={`nav-dropdown-btn ${isHistoryActive ? "parent-active" : ""} ${openMenus.history ? "open" : ""}`}
                            onClick={() => toggleMenu("history")}
                        >
                            <div className="nav-btn-content">
                                <History size={18} />
                                <span>Transaction History</span>
                            </div>
                            <ChevronDown size={15} className="nav-chevron" />
                        </button>

                        {openMenus.history && (
                            <div className="nav-submenu">
                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/history" : "/admin/history"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <History size={15} />
                                    <span>Transaction History</span>
                                </NavLink>

                                <NavLink
                                    to={role === "OPERATOR" ? "/operator/closing-history" : "/admin/closing-history"}
                                    className={({ isActive }) =>
                                        `nav-sub-item ${isActive ? "active" : ""}`
                                    }
                                    onClick={onCloseMobile}
                                >
                                    <FileSpreadsheet size={15} />
                                    <span>Closing History</span>
                                </NavLink>
                            </div>
                        )}
                    </div>

                    {/* MANAGEMENT DROPDOWN */}
                    {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                        <div className="nav-dropdown-wrapper">
                            <button
                                type="button"
                                className={`nav-dropdown-btn ${isManagementActive ? "parent-active" : ""} ${openMenus.management ? "open" : ""}`}
                                onClick={() => toggleMenu("management")}
                            >
                                <div className="nav-btn-content">
                                    <Users size={18} />
                                    <span>Management</span>
                                </div>
                                <ChevronDown size={15} className="nav-chevron" />
                            </button>

                            {openMenus.management && (
                                <div className="nav-submenu">
                                    <NavLink
                                        to="/admin/operators"
                                        className={({ isActive }) =>
                                            `nav-sub-item ${isActive ? "active" : ""}`
                                        }
                                        onClick={onCloseMobile}
                                    >
                                        <Users size={15} />
                                        <span>Operator</span>
                                    </NavLink>

                                    <NavLink
                                        to="/admin/banks"
                                        className={({ isActive }) =>
                                            `nav-sub-item ${isActive ? "active" : ""}`
                                        }
                                        onClick={onCloseMobile}
                                    >
                                        <Landmark size={15} />
                                        <span>Bank</span>
                                    </NavLink>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SUPER ADMIN */}
                    {role === "SUPER_ADMIN" && (
                        <>
                            <div className="nav-section-title">SUPER ADMIN</div>
                            <NavLink
                                to="/super-admin/admins"
                                className={({ isActive }) =>
                                    `nav-link-item ${isActive ? "active" : ""}`
                                }
                                onClick={onCloseMobile}
                            >
                                <ShieldCheck size={18} />
                                <span>Admins</span>
                            </NavLink>
                        </>
                    )}
                </nav>

                {/* Footer Profile */}
                <div className="sidebar-user-footer">
                    <div className="user-profile-badge">
                        <div className="user-avatar-circle">
                            {getInitials(user?.first_name, user?.last_name)}
                        </div>
                        <div className="user-info-text">
                            <div className="user-name-display">
                                {user?.first_name || "Pranav"} {user?.last_name || "Ghandge"}
                            </div>
                            <span className={`user-role-badge role-${(role || "admin").toLowerCase().replace("_", "-")}`}>
                                <span className="role-dot" />
                                <span>{role || "ADMIN"}</span>
                            </span>
                        </div>
                        <button
                            type="button"
                            className="user-logout-icon-btn"
                            onClick={() => setShowLogoutModal(true)}
                            title="Logout"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Logout Warning Confirmation Modal */}
            {showLogoutModal && (
                <div className="logout-modal-backdrop" onClick={() => setShowLogoutModal(false)}>
                    <div className="logout-modal-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal-icon-badge">
                            <AlertTriangle size={28} className="logout-warn-icon" />
                        </div>

                        <h3 className="logout-modal-title">Logout Confirmation</h3>
                        <p className="logout-modal-desc">
                            Are you sure you want to log out? Any unsaved changes will be lost and you will need to sign in again
                        </p>

                        <div className="logout-modal-actions">
                            <button
                                type="button"
                                className="logout-btn-cancel"
                                onClick={() => setShowLogoutModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="logout-btn-confirm"
                                onClick={handleConfirmLogout}
                            >
                                <LogOut size={15} />
                                <span>Yes, Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;