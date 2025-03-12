import { NavLink } from "react-router-dom";
import { useMediaQuery, useTheme, Drawer, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LogoImage from "/src/assets/logo/logo.jpeg";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const navItems: NavItem[] = [
    { title: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { title: "Users", path: "/users", icon: <UsersIcon /> },
    { title: "Products", path: "/products", icon: <ProductsIcon /> },
    { title: "Orders", path: "/orders", icon: <OrdersIcon /> },
    {
      title: "Testimonials",
      path: "/testimonials",
      icon: <TestimonialsIcon />,
    },
    { title: "Category", path: "/category", icon: <CategoryIcon /> },
    { title: "Collections", path: "/collections", icon: <CollectionsIcon /> },
    { title: "Enquiry", path: "/enquiry", icon: <EnquiryIcon /> },
    { title: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  // Sidebar content component to reuse for both mobile and desktop
  const SidebarContent = () => (
    <div
      style={{ background: "var(--secondary-color)" }}
      className=" text-white w-64 h-full flex flex-col"
    >
      <div className="p-4 flex items-center justify-center">
        <img src={LogoImage} alt="Company Logo" className="h-12 w-auto" />
      </div>

      {!isLargeScreen && (
        <div className="absolute top-4 right-4">
          <IconButton onClick={onClose} color="inherit" size="small">
            <CloseIcon />
          </IconButton>
        </div>
      )}

      <nav className="mt-6 overflow-y-auto flex-1">
        <ul>
          {navItems.map((item, index) => (
            <li key={index} className="px-2 py-1">
              <NavLink
                to={item.path}
                onClick={!isLargeScreen ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-all ${
                    isActive
                      ? "bg-green-900 text-white"
                      : "text-gray-200 hover:bg-green-800"
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  // For large screens, show the sidebar permanently
  if (isLargeScreen) {
    return (
      <aside className="h-screen">
        <SidebarContent />
      </aside>
    );
  }

  // For mobile/tablet screens, use a drawer that can be toggled
  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better mobile performance
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: "16rem",
          boxSizing: "border-box",
          border: "none",
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  );
};

export default Sidebar;

// Icons Components remain the same
const DashboardIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const UsersIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const ProductsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

const OrdersIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const TestimonialsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const CategoryIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h11M9 21V3m8 18V3m-4 18h8"
    />
  </svg>
);

const CollectionsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

const EnquiryIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16h8M8 12h8M8 8h8"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
