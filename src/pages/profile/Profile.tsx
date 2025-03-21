import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box } from "@mui/material";
import { ActionContext } from "../../context/ActionContext"; // Import the ActionContext
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { getProfile, updateProfile } from "../../api/profile";

const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  const { setActionHandlers } = useContext(ActionContext); // Use the ActionContext

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = "123"; // Replace with actual token
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
  };

  // ✅ Use `useCallback` to prevent unnecessary re-renders
  const handleSubmit = useCallback(async () => {
    console.log("Form submitted"); // Add this log to confirm form submission
    const token = "123"; // Replace with actual token
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
  }, [name, email]); // ✅ Add dependencies properly

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
        <div className="max-w-md mx-auto mt-10">
          <h2 className="text-center text-3xl font-bold mb-8 text-green-600">
            Profile
          </h2>

          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-medium mb-2 text-left">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="Name"
              className="shadow border rounded w-full py-3 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-2 text-left">
              Email
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                value={email}
                readOnly
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="shadow border rounded w-full py-3 px-3 text-gray-500 bg-gray-100 cursor-not-allowed"
              />
              {showEmailAlert && (
                <div className="absolute right-0 transform translate-x-full ml-10 bg-red-100 text-red-700 px-3 py-1 rounded shadow-md text-sm">
                  Cannot edit this field
                </div>
              )}
            </div>
          </div>
        </div>
      </Box>

      {/* Bottom section - fixed with increased bottom spacing */}
      <Box
        sx={{
          padding: 3, // Increased padding
          paddingBottom: 4, // Extra bottom padding
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
