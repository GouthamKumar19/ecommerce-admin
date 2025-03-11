import React, { useState } from "react";
import { Typography, Grid, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ImageSelection from "../components/common/ImageSelection";

// Define interface matching what ImageSelection expects
interface CollectionForm {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionForm[]>([]);

  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/collections");
  };

  const handleAddCollection = () => {
    // Implement add collection logic here
    console.log("Adding collection:", { collectionName, images });
    navigate("/collections");
  };

  return (
    <div className="ml-8 mr-8 mb-6">
      <div
        className="collection-form-content mb-4 space-y-8 mx-auto overflow-hidden example"
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div className="form-group text-left">
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
              Collection Images
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
              <div className="flex justify-end mt-4">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#0d7f3f",
                    color: "white",
                    marginRight: "8px",
                    minWidth: "100px",
                  }}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#0d7f3f",
                    color: "white",
                    minWidth: "100px",
                  }}
                  onClick={handleAddCollection}
                >
                  Add
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default CollectionForm;
