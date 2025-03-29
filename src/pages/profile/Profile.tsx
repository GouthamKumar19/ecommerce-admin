import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, TextField } from "@mui/material";
import Cookies from "js-cookie";
import { ActionContext } from "../../context/ActionContext";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { getProfile, updateProfile } from "../../api/profile";


const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [currentProfileData, setCurrentProfileData] = useState<any>(null);

  const { setActionHandlers } = useContext(ActionContext);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = Cookies.get("authToken") || ""; // Get token from cookies
        const response = await getProfile(token);
        const { name, email } = response.data;

        setName(name);
        setEmail(email);
        // Store the entire profile data to use in update
        setCurrentProfileData(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fallback to cookies for profile data
  useEffect(() => {
    const storedName = Cookies.get("name");
    const storedEmail = Cookies.get("email");

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  // Name input change handler with validation
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

  // Email field hover handlers
  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
  };

  // Submit handler to update profile
  const handleSubmit = useCallback(async () => {
    if (nameError) {
      return; // Prevent submission if there are errors
    }

    const token = Cookies.get("authToken") || ""; // Get token from cookies
    try {
      if (currentProfileData) {
        const response = await updateProfile(token, name, currentProfileData);
        console.log("Profile updated successfully:", response.message);

        // Optionally, you can add a success toast or notification here
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally, add error handling toast or notification
    }
  }, [name, nameError, currentProfileData]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    console.log("Form cancelled");
    // Reset the form or perform any cancel actions here
    // For example, reset to original name
    
    if (currentProfileData) {
      setName(currentProfileData.name);
    }
  }, [currentProfileData]);

  // Set action handlers
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
      {/* Top navigation section */}
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

      {/* Main content section */}
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
            {/* Name Input */}
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
                sx={{ height: "40px" }}
              />
            </div>

            {/* Email Input */}
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

      {/* Bottom action section */}
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
