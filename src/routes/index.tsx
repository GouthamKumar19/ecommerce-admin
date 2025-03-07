import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import LoginPage from "../pages/auth/login";
import DashboardPage from "../pages/dashboard/dashboard";
import UsersPage from "../pages/users/users";
import UserDetailsPage from "../pages/users/user-details";
import NotFoundPage from "../pages/not-found";
import Version from "../pages/version";
import Profile from "../pages/profile/Profile";
import OrderDetails from "../pages/orders/order-details";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/version",
    element: <Version />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "",
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:id",
        element: <UserDetailsPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/orders",
        element: <OrderDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
