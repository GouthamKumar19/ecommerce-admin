import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { useState } from "react";


const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="overflow-y-hidden flex bg-gray-100 w-screen ">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} />

      {/* Main Content */}
      <div className="overflow-y-hidden flex flex-col flex-1 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <main className="overflow-y-hidden flex-1 overflow-auto p-4 mb-0">
          <div className="container mx-auto">
            <Outlet />
            
          </div>
        </main>

        
      </div>
    </div>
  );
};

export default MainLayout;
