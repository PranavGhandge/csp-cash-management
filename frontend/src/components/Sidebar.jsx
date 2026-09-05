import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const role = user?.role;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <aside className="sidebar">

            <div className="sidebar-header">
                <h2>CSP</h2>
                <p>Cash Management</p>
            </div>

            <nav>

                {/* Common */}
                <NavLink to="/dashboard">
                    Dashboard
                </NavLink>


                {/* SUPER ADMIN */}
                {role === "SUPER_ADMIN" && (
                    <>
                        <h4>Administration</h4>

                        <NavLink to="/super-admin/admins">
                            Admin Management
                        </NavLink>
                    </>
                )}


                {/* ADMIN */}
                {role === "ADMIN" && (
                    <>
                        <h4>Management</h4>

                        <NavLink to="/admin/operators">
                            Operators
                        </NavLink>

                        <NavLink to="/admin/banks">
                            Banks
                        </NavLink>

                        <h4>Cash Management</h4>

                        <NavLink to="/admin/opening-balance">
                            Opening Balance
                        </NavLink>

                        <NavLink to="/admin/physical-cash-opening">
                            Physical Cash Opening
                        </NavLink>

                        <h4>Transactions</h4>

                        <NavLink to="/admin/transactions">
                            Transactions
                        </NavLink>

                        <NavLink to="/admin/closing">
                            Cash Closing
                        </NavLink>

                        <NavLink to="/admin/history">
                            History
                        </NavLink>
                    </>
                )}


                {/* OPERATOR */}
                {role === "OPERATOR" && (
                    <>
                        <h4>Transactions</h4>

                        <NavLink to="/operator/transactions">
                            Transactions
                        </NavLink>

                        <NavLink to="/operator/closing">
                            Cash Closing
                        </NavLink>

                        <NavLink to="/operator/history">
                            History
                        </NavLink>
                    </>
                )}

            </nav>

            <div className="sidebar-footer">

                <p>
                    {user?.first_name} {user?.last_name}
                </p>

                <small>{role}</small>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;