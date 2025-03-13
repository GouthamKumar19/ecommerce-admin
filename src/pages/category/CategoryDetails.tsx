import React from "react";
import CategoryForm from "../../components/Category/CategoryForm";
import { Box, Button } from "@mui/material";
import ArrowBackButton from "../../components/common/ArrowBackButton";
import { useNavigate } from "react-router-dom"; // Adjust the import path as necessary

const CategoryDetails: React.FC = () => {
  const navigate = useNavigate();
  // Handlers for Add and Cancel actions
  const handleAdd = () => {
    console.log("Add button clicked");
    // Implement form submission logic here
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    // Implement reset or navigation logic here
  };

  const handleBack = () => {
    console.log("Back button clicked");
    navigate(-1)
    // Implement navigation back logic here
  };

  return (
    <div className="bg-white px-4 rounded-lg shadow example">
      {/* Fixed Back Button Section */}
      <div
        style={{
          position: "fixed",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "80%",
          zIndex: 10, // Ensure it appears above other elements
          padding: "8px", // Padding to ensure button is not cramped
          marginBottom: "20px", // Space below the button
        }}
      >
        <div
          style={{
            width: "100%",
            background: "white",
            borderRadius: "4px",
            height: "50px",
          }}
        >
          <ArrowBackButton onClick={handleBack} />
          <p
            style={{
              color: "#0d7f3f",
              marginLeft: "50px", // Space between button and text
              fontSize: "20px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginTop: "-46px", // Add margin to align with the back button
            }}
          >
            ADD CATEGORY
          </p>
        </div>
      </div>

      {/* Main Content with padding to avoid overlap */}
      <div style={{ paddingTop: "70px" }}>
        {" "}
        {/* Adjusted padding for fixed header */}
        {/* Buttons at the top (if needed left for future use) */}
        <div className="flex justify-end gap-3 mb-4 ">
          {/* Additional buttons can go here if needed */}
        </div>
        {/* Category Form */}
        <CategoryForm />
        {/* Fixed Buttons at Bottom Right */}
        <Box
          sx={{
            position: "fixed",
            backgroundColor: "white",
            bottom: "10px",
            right: "20px",
            zIndex: 1000,
            py: 2,
            px: 4,
            borderRadius: "4px",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            maxWidth: "calc(100% - 16px)", // Keep within the container with some margin
            width: "auto",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{
              borderColor: "#0d7f3f",
              color: "#0d7f3f",
              width: "96px",
              "&:hover": {
                borderColor: "grey.700",
                backgroundColor: "grey.50",
              },
            }}
          >
            CANCEL
          </Button>

          <Button
            variant="contained"
            onClick={handleAdd}
            sx={{
              bgcolor: "var(--secondary-color, #4CAF50)",
              color: "white",
              width: "96px",
              "&:hover": {
                bgcolor: "var(--secondary-dark-color, #388E3C)",
              },
            }}
          >
            ADD
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default CategoryDetails;
