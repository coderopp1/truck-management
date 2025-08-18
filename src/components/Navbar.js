import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Navbar({ username, setUsername }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Extract user role and type from auth cookie
  const getUserData = () => {
    const authCookie = Cookies.get("auth");
    if (!authCookie) return null;

    try {
      return JSON.parse(authCookie);
    } catch (err) {
      console.error("Failed to parse auth cookie");
      return null;
    }
  };

  const userData = getUserData();
  const userType = userData?.type;
  const userRole = userData?.role;
  const displayName = username || userData?.name || "Guest User";

  // Sync username from cookie if not passed
  useEffect(() => {
    if (userData?.name && !username) {
      setUsername(userData.name);
    }
  }, [username, userData, setUsername]);

  const handleLogout = () => {
    setUsername(null);
    localStorage.removeItem("username");
    Cookies.remove("auth"); // Clear auth cookie
    setMenuOpen(false);
    navigate("/login");
  };

  // Define menu items dynamically based on role/type
  const getMenuItems = () => {
    const items = [{ name: "Home", path: "/" }];

    // Only allow "Add Truck" for non-external or non-user roles
    if (!(userType === "external" && userRole === "user")) {
      items.push({ name: "Add Truck", path: "/add" });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <header className="bg-blue-600 text-white p-4 relative z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="font-bold text-lg">Truck Management</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className="hover:underline">
              {item.name}
            </Link>
          ))}

          {!userData ? (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          ) : (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Floating Popup Sidebar */}
      <div
        className={`fixed top-10 right-4 w-56 h-[80%] bg-white text-gray-900 rounded-xl shadow-2xl transform z-50 transition-all duration-300 overflow-y-auto
          ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center border-b border-gray-200 space-x-3">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold">{displayName}</p>
            <p className="text-xs text-gray-500 capitalize">
              {userType} • {userRole}
            </p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex flex-col p-4 space-y-1">
          {menuItems.map((item, idx) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-md hover:bg-gray-100 transition-all duration-300 transform ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {item.name}
            </Link>
          ))}

          {/* Login or Logout */}
          {!userData ? (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`p-2 rounded-md hover:bg-gray-100 transition-all duration-300 transform ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: `${menuItems.length * 100}ms` }}
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className={`p-2 text-left rounded-md hover:bg-gray-100 transition-all duration-300 transform ${
                menuOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: `${menuItems.length * 100}ms` }}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}