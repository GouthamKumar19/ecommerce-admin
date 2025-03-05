import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <header className="bg-[#0d7f3f] h-14 flex items-center justify-between px-6">
      {/* Sidebar Toggle Button */}
      

      {/* Centered Title */}
      <h1 className="text-base text-[30px] font-semibold text-white tracking-wide ml-130">
       Dashboard
      </h1>

      {/* User Profile */}
      <div className="flex items-center space-x-2">
        <span className="text-white text-sm font-medium">Admin User</span>
        <img
          className="h-8 w-8 rounded-full border border-white"
          src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
          alt="Profile"
        />
      </div>
    </header>
  );
};

export default Header;
