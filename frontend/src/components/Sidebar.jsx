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
            {/* Header / Brand (Screenshot 1) */}
            <div className="sidebar-brand">
                <div className="brand-icon-wrap">
                    <Wallet size={22} />
                </div>
                <div className="brand-details">
                    <h2>CSP Portal</h2>
                    <p>CASH FLOW PRO</p>
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

                {/* SUPER ADMIN */}
                {role === "SUPER_ADMIN" && (
                    <>
                        <div className="nav-section-title">ADMINISTRATION</div>
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
                            <span>Operators</span>
                        </NavLink>

                        <NavLink
                            to="/admin/banks"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Landmark size={18} />
                            <span>Banks</span>
                        </NavLink>
                    </>
                )}

                {/* CASH MANAGEMENT */}
                <div className="nav-section-title">CASH MANAGEMENT</div>
                {(role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <>
                        <NavLink
                            to="/admin/opening-balance"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Wallet size={18} />
                            <span>Opening Balance</span>
                        </NavLink>

                        <NavLink
                            to="/admin/physical-cash-opening"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Coins size={18} />
                            <span>Physical Cash Opening</span>
                        </NavLink>

                        <NavLink
                            to="/admin/transactions"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <ArrowLeftRight size={18} />
                            <span>Record Transaction</span>
                        </NavLink>

                        <NavLink
                            to="/admin/closing"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Lock size={18} />
                            <span>Cash Closing</span>
                        </NavLink>
                    </>
                )}

                {role === "OPERATOR" && (
                    <>
                        <NavLink
                            to="/operator/transactions"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <ArrowLeftRight size={18} />
                            <span>Record Transaction</span>
                        </NavLink>

                        <NavLink
                            to="/operator/closing"
                            className={({ isActive }) =>
                                `nav-link-item ${isActive ? "active" : ""}`
                            }
                            onClick={onCloseMobile}
                        >
                            <Lock size={18} />
                            <span>Cash Closing</span>
                        </NavLink>
                    </>
                )}

                {/* AUDIT & REPORTS */}
                <div className="nav-section-title">AUDIT & REPORTS</div>
                <NavLink
                    to={role === "OPERATOR" ? "/operator/history" : "/admin/history"}
                    className={({ isActive }) =>
                        `nav-link-item ${isActive ? "active" : ""}`
                    }
                    onClick={onCloseMobile}
                >
                    <History size={18} />
                    <span>Transaction History</span>
                </NavLink>

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
                        <span className="user-role-badge">
                            {role || "ADMIN"}
                        </span>
                    </div>
                </div>

                <button
                    className="sidebar-logout-btn"
                    onClick={handleLogout}
                    title="Logout from system"
                >
                    <LogOut size={16} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;