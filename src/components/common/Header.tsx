import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();

    // Define all path patterns and their corresponding titles
    const pathPatterns = {
      '/products': 'Products',
      '/product': 'Products', // Handle single product routes
      '/users': 'Users',
      '/testimonials': 'Testimonials',
      '/category': 'Category',
      '/collections': 'Collections',
      '/enquiry': 'Enquiry',
      '/settings': 'Settings',
      '/profile': 'Profile',
      '/orders': 'Orders',
      '/dashboard': 'Dashboard',
      '/': 'Dashboard'
    };

    // Check each pattern against the current path
    for (const [pattern, title] of Object.entries(pathPatterns)) {
      if (path.startsWith(pattern)) {
        return title;
      }
    }

    return 'Dashboard'; // Default fallback
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setTimeout(() => setLogoutVisible(true), 10);
    setDropdownOpen(false);
  };

  const confirmLogout = () => {
    setLogoutVisible(false);
    setTimeout(() => {
      setShowLogoutConfirm(false);
      navigate("/auth/login");
    }, 300);
  };

  const cancelLogout = () => {
    setLogoutVisible(false);
    setTimeout(() => setShowLogoutConfirm(false), 0);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      <header className="bg-[#0d7f3f] h-14 flex items-center px-6 relative">
        {/* Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-green-700 p-2 rounded-lg transition-colors"
          aria-label="Toggle Sidebar"
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

        {/* Center section with title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <h1 className="text-white text-2xl font-semibold tracking-wide whitespace-nowrap">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right section with profile */}
        <div className="ml-auto flex items-center space-x-6">
          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <span className="text-white text-sm font-medium">AnmolSShetty</span>
              <img
                className="h-8 w-8 rounded-full border border-white"
                src="https://ui-avatars.com/api/?name=AnmolSShetty&background=0D8ABC&color=fff"
                alt="Profile"
              />
              <svg
                className={`h-4 w-4 text-white transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-100 text-gray-900">
                <div
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                >
                  Profile
                </div>
                <div
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-200 ${
            logoutVisible
              ? "backdrop-blur-md bg-black/40 opacity-100"
              : "opacity-0"
          }`}
        >
          <div
            className={`bg-white shadow-xl rounded-2xl p-6 max-w-sm w-full mx-4 relative transition-all duration-200 transform ${
              logoutVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {/* Close Button */}
            <div
              onClick={cancelLogout}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>

            {/* Icon */}
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01"
                ></path>
              </svg>
            </div>

            <h3 className="text-xl font-semibold text-center text-gray-800 mt-4">
              Are you sure?
            </h3>
            <p className="text-sm text-center text-gray-500 mt-2">
              You will be logged out of your account.
            </p>

            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={confirmLogout}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Yes
              </button>
              <button
                onClick={cancelLogout}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;