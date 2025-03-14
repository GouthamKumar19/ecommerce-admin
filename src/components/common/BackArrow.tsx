import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

const BackArrow = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the action type from URL or state
  const getActionTitle = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const action = searchParams.get("action");

    if (path.includes("/product/new") || action === "add") {
      return "Add Product";
    } else if (path.includes("/product/") || action === "edit") {
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
