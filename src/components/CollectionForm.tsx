import React, { useState } from "react";
import { Typography, Grid, Box, Button } from "@mui/material";
import ImageSelection from "../components/common/ImageSelection";
import ArrowBackButton from "../components/common/ArrowBackButton";
import { useNavigate } from "react-router-dom";

// Define interface matching what ImageSelection expects
interface CollectionForm {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionForm[]>([]);
  const navigate=useNavigate();

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
    // Implement back navigation logic here
    navigate(-1);
  };

  return (
    <div className="ml-8 mr-8 mb-6">
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
        </div>
      </div>

      <div
        className="collection-form-content mb-4 space-y-8 mx-auto overflow-hidden example"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }} // Adjusting for fixed button above
      >
        <div className="form-group text-left mt-30">
          <Typography variant="subtitle1" gutterBottom align="left">
            COLLECTION NAME
          </Typography>
          <input
            type="text"
            id="collectionName"
            placeholder="Enter Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "16px",
            }}
          />
        </div>

        <Grid
          container
          spacing={3}
          justifyContent="flex-start"
          style={{ flex: 1 }}
        >
          <Grid item xs={12} style={{ height: "100%" }}>
            <Typography variant="subtitle1" gutterBottom align="left">
              COLLECTION IMAGES
            </Typography>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "6px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                p: 4,
                width: "100%",
              }}
            >
              <ImageSelection images={images} setImages={setImages} />
            </Box>
          </Grid>
        </Grid>
      </div>

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
  );
};

export default CollectionForm;
