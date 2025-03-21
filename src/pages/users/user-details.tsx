import React, { useEffect, useContext } from "react";
import { Box } from "@mui/material";
import UserDetailsForm from "../../components/userDetails/UserDetails";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";

export const UserDetailsPage = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Check if we're in edit mode
    if (id && id !== "new") {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    // Set up action handlers for the ActionBox component
    setActionHandlers({
      onConfirm: handleSave,
      onCancel: handleCancel,
    });

    // Cleanup function to reset handlers when component unmounts
    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [setActionHandlers]);

  const handleSave = async () => {
    setIsLoading(true);

    // The actual save logic is handled in the UserDetailsForm component
    // This is just a proxy function to communicate with the form

    // The actual API call and validation will be done in the child component
    // We simulate a successful operation here
    setTimeout(() => {
      setIsLoading(false);
      navigate("/users");
    }, 500);
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        borderRadius: "8px",
      }}
    >
      {/* Top section - fixed */}
      <Box
        sx={{
          padding: 2,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <BackArrow />
      </Box>

      {/* Middle section - scrollable with padding at bottom to prevent content overlap */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px", // Add extra padding at the bottom to prevent overlap
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
        <UserDetailsForm />
      </Box>

      {/* Bottom section with ActionBox component */}
      <Box
        sx={{
          padding: 3,
          paddingBottom: 4,
          boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <ActionBox
          cancelText="Cancel"
          confirmText={isEdit ? "Update" : "Add"}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default UserDetailsPage;
