import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import LoginPage from "../pages/auth/login";
import DashboardPage from "../pages/dashboard/dashboard";
import UsersPage from "../pages/users/users";
import { UserDetailsPage } from "../pages/users/user-details";
import NotFoundPage from "../pages/not-found";
import Version from "../pages/version";
import TestimonialsPage from "../pages/testimonials/Testimonials";
import TestimonialsDetails from "../pages/testimonials/Testimonials-details";
import ProductPage from "../pages/product/product";
import { ProductDetails } from "../pages/product/product-details";
import Profile from "../pages/profile/Profile";
import OrderDetails from "../pages/orders/order-details";
import Enquiry from "../pages/enquiry/enquiry-section";
import CollectionsPage from "../pages/collections/Collections";

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
        path: "users/new",
        element: <UserDetailsPage />, // Reuse UserDetailsPage for creating new user
      },
      {
        path: "/user/id",
        element: <UserDetailsPage />,
      },
      {
        path: "testimonials",
        element: <TestimonialsPage />,
      },
      {
        path: "testimonials/new",
        element: <TestimonialsDetails />,
      },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/product/new",
        element: <ProductDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/orders",
        element: <OrderDetails />,
      },
      {
        path: "/enquiry",
        element: <Enquiry />,
      },
      {
        path: "//collections",
        element: <CollectionsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
