import React from "react";
import CategoryForm from "../../components/Category/CategoryForm";
import { Box, Button } from "@mui/material";

const CategoryDetails: React.FC = () => {
  // Handlers for Add and Cancel actions
  const handleAdd = () => {
    console.log("Add button clicked");
    // Implement form submission logic here
  };

  const handleCancel = () => {
    console.log("Cancel button clicked");
    // Implement reset or navigation logic here
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow example">
      {/* Buttons at the top */}
      <div className="flex justify-end gap-3 mb-4">
        
      </div>

      {/* Category Form */}
      <CategoryForm />

      {/* Fixed Buttons at Bottom Right */}
      <Box
        sx={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          py: 2,
          px: 2,
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
  );
};

export default CategoryDetails;
