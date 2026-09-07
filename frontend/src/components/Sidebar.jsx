import { NavLink, useNavigate } from "react-router-dom";
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
    ShieldCheck
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = ({ onCloseMobile }) => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const role = user?.role;

    const getInitials = (firstName, lastName) => {
        const first = firstName ? firstName[0].toUpperCase() : "P";
        const last = lastName ? lastName[0].toUpperCase() : "G";
        return `${first}${last}`;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };


    return (
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

                {/* CASH MANAGEMENT */}
                <div className="nav-section-title">CASH MANAGEMENT</div>
                {/* Opening Balance (Online Cash Opening) */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/opening-balance" : "/admin/opening-balance"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <Wallet size={18} />
                    <span>Opening Balance</span>
                </NavLink>

                {/* Physical Cash Opening */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/physical-cash-opening" : "/admin/physical-cash-opening"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <Coins size={18} />
                    <span>Physical Cash Opening</span>
                </NavLink>

                {/* Create Transaction */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/transactions" : "/admin/transactions"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <ArrowLeftRight size={18} />
                    <span>Create Transaction</span>
                </NavLink>

                {/* Transaction Records */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/history" : "/admin/history"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <History size={18} />
                    <span>Transaction Records</span>
                </NavLink>

                {/* Cash Closing */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/closing" : "/admin/closing"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <Lock size={18} />
                    <span>Cash Closing</span>
                </NavLink>

                {/* Closing History */}
                <NavLink
                    to={role === "OPERATOR" ? "/operator/closing-history" : "/admin/closing-history"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <FileSpreadsheet size={18} />
                    <span>Closing History</span>
                </NavLink>

                {/* MANAGEMENT */}
                {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <>
                        <div className="nav-section-title">MANAGEMENT</div>
                        <NavLink
                            to="/admin/operators"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Users size={18} />
                            <span>Operator</span>
                        </NavLink>

                        <NavLink
                            to="/admin/banks"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Landmark size={18} />
                            <span>Bank</span>
                        </NavLink>
                    </>
                )}

                {/* SUPER ADMIN */}
                {role === "SUPER_ADMIN" && (
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
                        className="user-logout-icon-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;