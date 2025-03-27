import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import Cookies from "js-cookie"; // Import js-cookie
import { ActionContext } from "../../context/ActionContext"; // Import the ActionContext
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { getProfile, updateProfile } from "../../api/profile";

const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");

  const { setActionHandlers } = useContext(ActionContext); // Use the ActionContext

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = "your_actual_token"; // Replace with actual token
        const response = await getProfile(token);
        const { name, email } = response.data;

        setName(name);
        setEmail(email);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Get profile data from cookies
    const storedName = Cookies.get("name");
    const storedEmail = Cookies.get("email");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);

    // Validate the name input
    const regex = /^[A-Za-z\s]+$/; // Only allow letters and spaces
    if (value === "" || regex.test(value)) {
      setNameError(false);
      setNameErrorMessage("");
    } else {
      setNameError(true);
      setNameErrorMessage("Name should only contain letters.");
    }
  };

  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
  };

  // ✅ Use `useCallback` to prevent unnecessary re-renders
  const handleSubmit = useCallback(async () => {
    if (nameError) {
      return; // Prevent submission if there are errors
    }

    console.log("Form submitted"); // Add this log to confirm form submission
    const token = "your_actual_token"; // Replace with actual token
    try {
      const updatedProfile = {
        _id: "6512c5f3e4b09a12d8f42b68",
        name,
        email,
        role: "ADMIN",
        createdAt: "2024-02-06T15:30:00.000Z",
        updatedAt: new Date().toISOString(),
      };
      const response = await updateProfile(token, updatedProfile);
      console.log("Profile updated successfully:", response.message);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [name, email, nameError]); // ✅ Add dependencies properly

  const handleCancel = useCallback(() => {
    console.log("Form cancelled");
    // Reset the form or perform any cancel actions here
  }, []);

  // ✅ Set the action handlers only when functions change
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSubmit,
      onCancel: handleCancel,
    });
  }, [setActionHandlers, handleSubmit, handleCancel]);

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

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <div className="max-w-md mx-auto mt-10">
          <h2 className="text-center text-3xl font-bold mb-8 text-green-600">
            Profile
          </h2>

          <form noValidate autoComplete="off">
            <label className="block text-black text-lg font-medium mb-2 text-left">
              Name
            </label>
            <div className="mb-6">
              <TextField
                variant="outlined"
                size="small"
                value={name}
                onChange={handleNameChange}
                error={nameError}
                helperText={nameErrorMessage}
                fullWidth
                sx={{ height: "40px" }} // Change the height to make it smaller
              />
            </div>

            <div className="mb-8 relative">
              <label className="block text-black text-lg font-medium mb-2 text-left">
                Email
              </label>
              <TextField
                variant="outlined"
                size="small"
                value={email}
                InputProps={{
                  readOnly: true, // Make the email field read-only
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                fullWidth
                sx={{
                  height: "40px",
                  bgcolor: "#fafafa",
                }}
              />
              {showEmailAlert && (
                <div className="absolute right-0 transform translate-x-full ml-10 bg-red-100 text-red-700 px-3 py-1 rounded shadow-md text-sm">
                  Cannot edit this field
                </div>
              )}
            </div>
          </form>
        </div>
      </Box>

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
        <ActionBox />
      </Box>
    </Box>
  );
};

export default Profile;
