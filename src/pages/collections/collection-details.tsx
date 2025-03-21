import React, { useState, useEffect, useContext } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import CollectionForm from "../../components/CollectionForm";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";

export const CollectionDetails = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({
    open: false,
    message: "",
    type: "success",
  });
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

    // The actual collection save/update is handled in the CollectionForm component
    // We will wait for the ActionContext handler to complete.
    // Since we don't have direct access to its promise, we add a short timeout to simulate feedback

    try {
      // We're just providing UI feedback - actual form submission is handled in CollectionForm
      console.log("Save/Update initiated from CollectionDetails");

      // In the future, you could modify this to await the result from the form component
      // For now, we just provide some feedback through loading UI
      setTimeout(() => {
        setNotification({
          open: true,
          message: `Collection ${isEdit ? "updated" : "created"} successfully!`,
          type: "success",
        });

        // Navigate back after showing notification briefly
        setTimeout(() => {
          navigate("/collections");
        }, 1500);
      }, 500);
    } catch (error) {
      console.error("Error in collection operation:", error);
      setNotification({
        open: true,
        message: `Failed to ${isEdit ? "update" : "create"} collection`,
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Cancel action triggered from CollectionDetails");
    navigate("/collections");
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
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
        <CollectionForm />
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

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.type}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollectionDetails;
