import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu, Clock, Shield } from "lucide-react";
import "./AppLayout.css";

const AppLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [timeStr, setTimeStr] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTimeStr(
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-viewport">
            {/* Backdrop for mobile */}
            <div
                className={`sidebar-backdrop ${mobileOpen ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
            />

            {/* Sidebar with mobile class toggle */}
            <div className={mobileOpen ? "bank-sidebar mobile-open" : ""}>
                <Sidebar onCloseMobile={() => setMobileOpen(false)} />
            </div>

            {/* Main Application Area */}
            <div className="main-viewport">
                <header className="top-navbar">
                    <div className="nav-left-meta">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="portal-tag">
                            <Shield size={16} className="text-primary" />
                            <span>CSP Secure Portal</span>
                            <span className="badge badge-success">Encrypted</span>
                        </div>
                    </div>

                    <div className="nav-right-meta">
                        {timeStr && (
                            <div className="live-clock-badge">
                                <Clock size={14} />
                                <span>{timeStr}</span>
                            </div>
                        )}
                    </div>
                </header>

                <main className="page-content-wrapper">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
