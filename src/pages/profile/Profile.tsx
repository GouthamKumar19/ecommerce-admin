import React, { useState } from "react";
import { Box } from "@mui/material";

import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";

const Profile: React.FC = () => {
  
  const [name, setName] = useState("");
  const [email] = useState("abc@gmail.com");
  const [showEmailAlert, setShowEmailAlert] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleMouseEnter = () => {
    setShowEmailAlert(true);
  };

  const handleMouseLeave = () => {
    setShowEmailAlert(false);
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
