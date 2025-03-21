import React, { useState, useContext, useEffect } from "react";
import { Typography, Grid, Box, CircularProgress } from "@mui/material";
import ImageSelection from "../components/common/ImageSelection";
import { ActionContext } from "../context/ActionContext";
import {
  createCollection,
  getCollectionById,
  updateCollection,
} from "../api/collections";
import { useParams } from "react-router-dom";

// Define interface matching what ImageSelection expects
interface CollectionFormProps {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionFormProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();

  // Fetch collection details if we have an ID
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      const id = params.id;
      if (id) {
        setLoading(true);
        setIsEditMode(true);
        setCollectionId(id);

        try {
          const response = await getCollectionById(id);
          if (response.status === 200 && response.data) {
            setCollectionName(response.data.name);

            // If there's a banner image, set it as selected in the images array
            if (response.data.bannerImage) {
              const updatedImages = [...images];
              const imageIndex = updatedImages.findIndex(
                (img) => img.url === response.data.bannerImage
              );

              if (imageIndex >= 0) {
                // Image exists in the array, mark it as selected
                updatedImages.forEach((img, idx) => {
                  updatedImages[idx] = { ...img, selected: idx === imageIndex };
                });
              } else {
                // Image doesn't exist in array, add it
                updatedImages.push({
                  id: updatedImages.length + 1,
                  url: response.data.bannerImage,
                  selected: true,
                });
              }

              setImages(updatedImages);
            }
          }
        } catch (error) {
          console.error("Error fetching collection details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCollectionDetails();
  }, [params.id]);

  useEffect(() => {
    // Set up the action handlers for the ActionBox component
    setActionHandlers({
      onConfirm: handleConfirm,
      onCancel: handleCancel,
    });

    // Clean up the action handlers when the component unmounts
    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [collectionName, images, isEditMode, collectionId, setActionHandlers]);

  const handleConfirm = async () => {
    // Get the selected image URL or use empty string if none selected
    const selectedImage = images.find((img) => img.selected)?.url || "";

    // Prepare the form data
    const formData = {
      name: collectionName,
      bannerImage: selectedImage,
    };

    // Log to console as requested
    console.log("Collection Form Data:", formData);

    try {
      let response;
      if (isEditMode && collectionId) {
        // Update existing collection
        response = await updateCollection(collectionId, formData);
        console.log("Update API Response:", response);
      } else {
        // Create new collection
        response = await createCollection(formData);
        console.log("Create API Response:", response);
      }

      // Here you could add success notifications or redirects
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} collection:`,
        error
      );
      // Here you could add error handling
    }
  };

  const handleCancel = () => {
    // Handle cancel action - could be navigation back or form reset
    console.log("Form submission cancelled");
    // You might want to add navigation logic here
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

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
