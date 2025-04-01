import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import ImageSelection from "../components/common/ImageSelection";
import { ActionContext } from "../context/ActionContext";
import {
  createCollection,
  getCollectionById,
  updateCollection,
} from "../api/collections";
import { useParams, useNavigate } from "react-router-dom";

// Define interface matching what ImageSelection expects
interface CollectionFormProps {
  id: number;
  url: string;
  selected: boolean;
}

interface FormErrors {
  collectionName: string;
  collectionImages: string;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<CollectionFormProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    collectionName: "",
    collectionImages: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();
  const navigate = useNavigate();

  // Fetch collection details if we have an ID
  useEffect(() => {
    const fetchCollectionDetails = async () => {
      const id = params.id;
      if (id && id !== "new") {
        setLoading(true);
        setIsEditMode(true);
        setCollectionId(id);

        try {
          const response = await getCollectionById(id);
          if (response.status === 200 && response.data) {
            setCollectionName(response.data.name);
            console.log("Fetched collection:", response.data);

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
          setErrorMessage(
            "Failed to load collection details. Please try again."
          );
          setShowError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCollectionDetails();
  }, [params.id]);

  // Add default images if none exist
  useEffect(() => {
    if (images.length === 0) {
      // Add some default placeholder images - using smaller image sizes
      setImages([
        {
          id: 1,
          url: "https://via.placeholder.com/150x100?text=Image+1",
          selected: false,
        },
        {
          id: 2,
          url: "https://via.placeholder.com/150x100?text=Image+2",
          selected: false,
        },
        {
          id: 3,
          url: "https://via.placeholder.com/150x100?text=Image+3",
          selected: false,
        },
      ]);
    }
  }, []);

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
  }, [collectionName, images, isEditMode, collectionId]);

  const validateForm = (): boolean => {
    const newErrors = { collectionName: "", collectionImages: "" };
    let isValid = true;

    // Validate collection name
    if (!collectionName.trim()) {
      newErrors.collectionName = "Collection name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(collectionName)) {
      newErrors.collectionName =
        "Collection name should only contain alphabets and spaces";
      isValid = false;
    }

    // Validate if at least one image is selected
    const selectedImage = images.find((img) => img.selected);
    if (!selectedImage) {
      newErrors.collectionImages = "At least one image must be selected";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setCollectionName("");
    setImages(images.map((img) => ({ ...img, selected: false })));
    setErrors({ collectionName: "", collectionImages: "" });
  };

  const handleConfirm = async () => {
    // Validate form
    if (!validateForm()) {
      console.log("Form validation failed");
      return false;
    }

    // Get the selected image URL or use empty string if none selected
    const selectedImage = images.find((img) => img.selected)?.url || "";

    // Check if image URL is likely to cause a 413 error (if it's a very long base64 string)
    if (
      selectedImage.startsWith("data:image") &&
      selectedImage.length > 100000
    ) {
      console.warn(
        "Selected image is a large base64 string, which might cause payload size issues"
      );
    }

    // Prepare the form data
    const formData = {
      name: collectionName,
      bannerImage: selectedImage,
    };

    // Log to console for debugging - be careful with large base64 strings
    console.log("Collection Form Data:", {
      name: formData.name,
      bannerImage: selectedImage.substring(0, 50) + "...", // Log just the beginning of the image URL
    });

    try {
      setLoading(true);
      let response;

      if (isEditMode && collectionId) {
        // Update existing collection
        response = await updateCollection(collectionId, formData);
        console.log("Update API Response status:", response.status);
      } else {
        // Create new collection
        console.log("Sending data to createCollection");
        response = await createCollection(formData);
        console.log("Create API Response status:", response.status);
      }

      // If successful, reset form or navigate
      console.log(
        `Collection ${isEditMode ? "updated" : "created"} successfully`
      );

      // Navigate to collections page after success
      navigate("/collections");
      return true; // Return success to the parent component
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} collection:`,
        error
      );

      // Show error message in a Snackbar instead of an alert
      setErrorMessage(
        error.message ||
          `Failed to ${isEditMode ? "update" : "create"} collection`
      );
      setShowError(true);
      return false; // Return failure to the parent component
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Handle cancel action - reset form and redirect
    console.log("Form submission cancelled");
    resetForm();
    navigate("/collections"); // Redirect to collections page or any other route
  };

  const handleCloseError = () => {
    setShowError(false);
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
          Collection Name
        </Typography>
        <TextField
          type="text"
          id="collectionName"
          placeholder="Enter Collection Name"
          value={collectionName}
          onChange={(e) => {
            const value = e.target.value;
            if (/^[a-zA-Z\s]*$/.test(value)) {
              setCollectionName(value);
              // Clear error when typing
              if (value.trim() && errors.collectionName) {
                setErrors({ ...errors, collectionName: "" });
              }
            } else {
              setErrors({
                ...errors,
                collectionName: "Only characters are allowed",
              });
            }
          }}
          error={!!errors.collectionName}
          helperText={errors.collectionName}
          fullWidth={false}
          sx={{
            width: "300px", // Reduce the width of the text field
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: errors.collectionName
                  ? "red"
                  : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover fieldset": {
                borderColor: errors.collectionName
                  ? "red"
                  : "rgba(0, 0, 0, 0.23)",
              },
              "&.Mui-focused fieldset": {
                borderColor: errors.collectionName
                  ? "red"
                  : "rgba(0, 0, 0, 0.23)",
              },
            },
            "& .MuiFormHelperText-root": {
              color: errors.collectionName ? "red" : "rgba(0, 0, 0, 0.87)",
            },
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
              border: errors.collectionImages ? "1px solid red" : "none",
            }}
          >
            <ImageSelection images={images} setImages={setImages} />
            {errors.collectionImages && (
              <Typography variant="body2" color="red" mt={2}>
                {errors.collectionImages}
              </Typography>
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              mt={2}
              display="block"
            >
              Note: Large images may cause upload issues. Consider using smaller
              images for better performance.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CollectionForm;
