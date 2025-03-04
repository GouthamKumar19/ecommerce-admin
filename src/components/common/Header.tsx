import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real application, you would clear authentication tokens here
    navigate("/auth/login");
  };

  return (
    <header className="bg-white shadow h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="mr-4 text-gray-500 focus:outline-none"
        >
          <svg
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
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center space-x-2 text-gray-700 focus:outline-none">
            <span>Admin User</span>
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
              alt="Profile"
            />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
