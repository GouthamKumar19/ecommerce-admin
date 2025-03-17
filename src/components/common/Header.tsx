import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ConfirmationDialog from "./Dialog";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use MUI theme and media queries for responsive behavior
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const getPageTitle = () => {
    const path = location.pathname.toLowerCase();

    // Define all path patterns and their corresponding titles
    const pathPatterns = {
      "/products": "PRODUCTS",
      "/product": "PRODUCTS", // Handle single product routes
      "/users": "USERS",
      "/testimonials": "TESTIMONIALS",
      "/category": "CATEGORY",
      "/collections": "COLLECTIONS",
      "/collections/new": "COLLECTIONS",
      "/collection/collection-details": "COLLECTIONS",
      "/enquiry": "ENQUIRY",
      "/settings": "SETTINGS",
      "/profile": "PROFILE",
      "/orders": "ORDERS",
      "/dashboard": "DASHBOARD",
      "/collection/:id": "COLLECTIONS",
      "/collections/collection-product": "COLLECTIONS",
      "/collection/collection-add-product": "COLLECTIONS",
      "/": "DASHBOARD",
    };

    // Check each pattern against the current path
    for (const [pattern, title] of Object.entries(pathPatterns)) {
      if (path.startsWith(pattern)) {
        return title;
      }
    }

    return "Dashboard"; // Default fallback
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
    setDropdownOpen(false);
  };

  const confirmLogout = (confirm: boolean) => {
    setShowLogoutConfirm(false);
    if (confirm) {
      navigate("/auth/login");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Fixed hamburger menu click handler
  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Hamburger menu clicked - calling toggle function");
    // Directly call the toggle function from props
    onToggleSidebar();
  };

  return (
    <>
      <header className="bg-[#0d7f3f] h-14 flex items-center px-6 relative">
        {/* Always show hamburger on mobile/tablet */}
        {isMobile && (
          <div
            onClick={handleMenuClick}
            className="text-white hover:bg-green-700 rounded-lg p-2 transition-colors z-20 cursor-pointer"
            aria-label="Toggle Sidebar"
          >
            <MenuIcon />
          </div>
        )}

        {/* Center section with title */}
        <div
          className={`${isMobile ? "absolute left-1/2 transform -translate-x-1/2" : "ml-135"} flex items-center`}
        >
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
              <span className="text-white text-sm font-medium">
                AnmolSShetty
              </span>
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
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-100 text-gray-900 z-50">
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
      <ConfirmationDialog
        open={showLogoutConfirm}
        title="Are you sure?"
        subtitle="You will be logged out of your account."
        onClose={confirmLogout}
      />
    </>
  );
};

export default Header;
