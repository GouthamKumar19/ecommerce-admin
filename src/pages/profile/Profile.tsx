import React, { useState, useContext, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";

import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { ActionContext } from "../../context/ActionContext";

const Profile: React.FC = () => {
  const [name, setName] = useState("");
  const [email] = useState("abc@gmail.com");
  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setActionHandlers } = useContext(ActionContext);

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    name: false,
  });

  // Set up the action handlers for the ActionBox component
  useEffect(() => {
    setActionHandlers({
      onConfirm: handleSaveProfile,
      onCancel: handleCancel,
    });

    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [setActionHandlers]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrors((prev) => ({ ...prev, name: false }));
  };

  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
  };

  const handleSaveProfile = async () => {
    if (!name) {
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }

    setIsLoading(true);
    // Mock API call for saving profile
    console.log("Saving profile with name:", name);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Could add a success message here
    }, 1000);
  };

  const handleCancel = () => {
    console.log("Profile update cancelled");
    // Could add navigation back or reset form here
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
        <div className="max-w-md mx-auto mt-10">
          <h2 className="text-center text-3xl font-bold mb-8 text-green-600">
            Profile
          </h2>

          <div className="mb-6">
            <TextField
              id="name"
              label="Name"
              value={name}
              onChange={handleNameChange}
              placeholder="Name"
              fullWidth
              variant="outlined"
              margin="normal"
              error={errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-lg font-medium mb-2 text-left">
              Email
            </label>
            <div className="relative flex items-center">
              <TextField
                type="email"
                value={email}
                fullWidth
                variant="outlined"
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                helperText={
                  showEmailAlert ? (
                    <Typography color="error">
                      Cannot edit this field
                    </Typography>
                  ) : (
                    ""
                  )
                }
              />
            </div>
          </div>
        </div>
      </Box>

      {/* Bottom section - fixed with increased bottom spacing */}
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
          confirmText="Save"
          cancelText="Cancel"
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Profile;
