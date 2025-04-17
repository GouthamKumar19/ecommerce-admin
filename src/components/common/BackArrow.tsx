import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

const BackArrow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the action type from URL or state
  const getActionTitle = () => {
    const path = location.pathname;
    const state = location.state;

    
    if (path.includes("/users/")) {
     
      if (state && state.user) {
        return "Edit User";
      } else {
        return "Add User";
      }
    }

    if (path.includes("/orders/")) {
      // Check if we have order data in state (viewing or editing)
      if (state && state.order) {
        return "View Order";
      }
    }
    if (path.includes("/testimonials/new")) {
      return "Add Testimonials";
    }
     if(path.includes("/testimonials/")){
      return "Edit Testimonials";
    }

    if (path.includes("/category/new")) {
      // Check if we have order data in state (viewing or editing)

      return "Add Category";
    }
    if (path.includes("/category/")) {
      return "Edit Category";
    }

    if (path.includes("/category/:id")) {
      return "Edit Category";
    }

    if (path.includes("/collection/")) {
      // Check if we have order data in state (viewing or editing)
      if (state && state.Collection) {
        return "Edit Collection";
      } else {
        return "Add Collection";
      }
    }

    if (path.includes("/profile")) {
      return "Profile";
    }
    if (path.includes("/collections/collection-product/:id")) {
      return "Collection Products";
    }

    // Original product logic
    if (path.includes("/product/new")) {
      return "Add Product";
    } else if (path.includes("/product/")) {
      return "Edit Product";
    }

    return "";
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex items-center">
      <IconButton onClick={handleBack}>
        <ArrowBackIcon />
      </IconButton>
      <h2 className="text-lg font-medium ml-2">{getActionTitle()}</h2>
    </div>
  );
};

export default BackArrow;
