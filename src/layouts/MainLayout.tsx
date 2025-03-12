import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useState, useEffect, useCallback } from "react";
import { useMediaQuery, useTheme } from "@mui/material";

const MainLayout = () => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  // Set initial sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(isLargeScreen);

  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarOpen(isLargeScreen);
  }, [isLargeScreen]);

  // Use useCallback to ensure the function reference remains stable
  // This prevents issues with event handlers being recreated on each render
  const toggleSidebar = useCallback(() => {
    console.log("Toggle sidebar called, current state:", sidebarOpen);
    setSidebarOpen((prevState) => !prevState);
  }, [sidebarOpen]);

  const closeSidebar = useCallback(() => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  }, [isLargeScreen]);

  // For debugging - log when the component renders and the current state
  console.log(
    "MainLayout rendering, sidebarOpen:",
    sidebarOpen,
    "isLargeScreen:",
    isLargeScreen
  );

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Main Content Area */}
      <div
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          width: "100%",
          marginLeft: isLargeScreen && sidebarOpen ? "16rem" : "0",
        }}
      >
        {/* Make sure to pass the handler properly */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* The z-index here ensures proper layering */}
      <div
        className="fixed top-0 left-0 h-full shadow-lg transition-transform duration-300 ease-in-out"
        style={{
          width: "16rem",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          zIndex: 50,
        }}
      >
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      </div>

      {/* Overlay with a lower z-index than the sidebar but higher than content */}
      {!isLargeScreen && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-md transition-opacity duration-300"
          onClick={closeSidebar}
          style={{ zIndex: 40 }}
        />
      )}
    </div>
  );
};

export default MainLayout;
