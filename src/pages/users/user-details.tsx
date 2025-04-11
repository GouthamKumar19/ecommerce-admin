import { useEffect, useContext, useState } from "react";
import { Box } from "@mui/material";
import UserDetailsForm from "../../components/userDetails/UserDetails";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";
import { useParams, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { User } from "../../types/users.types";

import { createUser,updateUser,getUserById } from "../../api/user";
export const UserDetailsPage = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // API functions moved from UserDetails component
  

  

  
  // Check if we're in edit mode and fetch user data if needed
  useEffect(() => {
    const fetchUser = async () => {
      if (id && id !== "new") {
        setIsEdit(true);
        setIsLoading(true);

        try {
          const response = await getUserById(id);
          if (response.status === 200 && response.data) {
            setUserData(response.data);
          } else {
            setSnackbarMessage("Failed to load user data. Please try again.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setSnackbarMessage("An error occurred while fetching user data.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
  }, [id]);

  // Handle form submission from the child component
  const handleSaveUser = async (formData: any) => {
    setIsLoading(true);

    try {
      let response;

      if (isEdit && id) {
        // Update existing user
        response = await updateUser(id, formData);
      } else {
        // Create new user
        response = await createUser(formData);
      }

      if (response.status === 200 || response.status === 201) {
        setSnackbarMessage(
          isEdit ? "User updated successfully" : "User created successfully"
        );
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Navigate back after short delay
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      } else {
        throw new Error(response.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      setSnackbarMessage(
        error instanceof Error ? error.message : "Failed to save user"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up action handlers for the ActionBox component
  useEffect(() => {
    setActionHandlers({
      onConfirm: () => {
        // This will trigger the onSave prop in the child component
        // The actual data is passed from the child to parent when this is called
        document.dispatchEvent(new Event("triggerSaveFromParent"));
      },
      onCancel: handleCancel,
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [setActionHandlers]);

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
        <UserDetailsForm
          userData={userData}
          isLoading={isLoading}
          onSave={handleSaveUser}
          isEditMode={isEdit}
        />
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

      {/* Snackbar for messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserDetailsPage;
