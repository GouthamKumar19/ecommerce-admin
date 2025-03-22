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
import CategoryPage from "../pages/category/Category";
import Order from "../pages/orders/orders";
import CollectionDetails from "../pages/collections/collection-details";
import { CategoryDetails } from "../pages/category/category-details";
import ProductAddPage from "../pages/collections/collectionProduct";
import CollectionAddPage from "../pages/collections/collectionAddProduct";

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
        path: "/users/:id",
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
        path: "testimonials/:id",
        element: <TestimonialsDetails />,
      },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "/collection/:id",
        element: <CollectionDetails />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/orders",
        element: <Order />,
      },
      {
        path: "/orders/:id",
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
      {
        path: "/collections/collection-product",
        element: <ProductAddPage />,
      },
      {
        path: "/collection/collection-product/:id",
        element: <CollectionAddPage />,
      },
      {
        path: "/category",
        element: <CategoryPage />,
      },
      {
        path: "/category/:id",
        element: <CategoryDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
