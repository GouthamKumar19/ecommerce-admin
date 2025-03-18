import React, { useState } from "react";
import { Typography, Grid, Box } from "@mui/material";
import ImageSelection from "../components/common/ImageSelection";

// Define interface matching what ImageSelection expects
interface CollectionFormProps {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionFormProps[]>([]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        bgcolor: "white",
        borderRadius: "8px",
        padding: 4,
      }}
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

      <Grid container spacing={3} justifyContent="flex-start">
        <Grid item xs={12}>
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CollectionForm;
