import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import ImageSelection, {
  ProductImage,
} from "../components/common/ImageSelection";
import { ActionContext } from "../context/ActionContext";
import {
  createCollection,
  getCollectionById,
  updateCollection,
} from "../api/collections";
import { useParams, useNavigate } from "react-router-dom";
import { getPresignedUrl, uploadFile } from "../api/collectionImage";

/**
 * Constructs full S3 image URL from file path or returns fallback image
 * @param {string | undefined} filePath - The path of the image file
 * @returns {string} - Complete S3 URL or fallback image URL
 */
export const getImage = (filePath?: string): string => {
  // Get S3 base URL from environment variables
  const s3BaseUrl =
    import.meta.env.VITE_S3_URL ||
    "https://your-default-s3-bucket.s3.amazonaws.com/";

  // Fallback/dummy image URL
  const fallbackImage = "/assets/images/placeholder.jpg";

  // If no file path provided or it's empty, return fallback image
  if (!filePath || filePath.trim() === "") {
    return fallbackImage;
  }

  // Check if the filePath already contains the full URL
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  // Ensure file path starts with a forward slash if not already
  const formattedPath = filePath.startsWith("/")
    ? filePath.substring(1)
    : filePath;

  // Construct and return the full S3 URL
  return `${s3BaseUrl}${formattedPath}`;
};

interface FormErrors {
  collectionName: string;
  collectionImages: string;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState("");
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    collectionName: "",
    collectionImages: "",
  });
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [showError, setShowError] = useState(false);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const { setActionHandlers } = useContext(ActionContext);
  const params = useParams();
  const navigate = useNavigate();

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

            if (response.data.bannerImage) {
              const bannerImageUrl = getImage(response.data.bannerImage);
              const updatedImages = [...images];
              const imageIndex = updatedImages.findIndex(
                (img) => img.url === bannerImageUrl
              );
              if (imageIndex >= 0) {
                updatedImages.forEach((img, idx) => {
                  updatedImages[idx] = { ...img, selected: idx === imageIndex };
                });
              } else {
                updatedImages.push({
                  id: Date.now(),
                  url: bannerImageUrl,
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
    setActionHandlers({ onConfirm: handleConfirm, onCancel: handleCancel });
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

    if (!collectionName.trim()) {
      newErrors.collectionName = "Collection name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]*$/.test(collectionName)) {
      newErrors.collectionName =
        "Collection name should only contain alphabets and spaces";
      isValid = false;
    }

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

  // Helper function to handle image uploads if needed
  const uploadPendingImages = async () => {
    const selectedImage = images.find((img) => img.selected);
    if (!selectedImage) return null;

    // Check if the image is a base64 string that needs uploading
    if (selectedImage.url.startsWith("data:image")) {
      setUploadInProgress(true);
      try {
        // Convert base64 to blob
        const response = await fetch(selectedImage.url);
        const blob = await response.blob();

        // Create a file from the blob
        const fileName = `image_${Date.now()}.jpg`;
        const imageFile = new File([blob], fileName, { type: "image/jpeg" });

        // Store the formatted filename that will be sent to the server
        const formattedFileName = `public/ecommerce/collections/${fileName.toLowerCase().replace(/\s+/g, "_")}`;

        // Get presigned URL and upload
        const presignedUrl = await getPresignedUrl(fileName, "collections");
        await uploadFile(presignedUrl, imageFile);

        // Return the formatted filename instead of the presigned URL
        return formattedFileName;
      } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
      } finally {
        setUploadInProgress(false);
      }
    }

    // If the image is already a URL, just return it
    return selectedImage.url;
  };

  const handleConfirm = async () => {
    if (!validateForm()) {
      console.log("Form validation failed");
      return false;
    }

    try {
      setLoading(true);
      let imageUrl;

      // Upload any pending images (base64 data)
      try {
        imageUrl = await uploadPendingImages();
        if (!imageUrl) {
          return false;
        }
      } catch (error) {
        console.error("Error uploading image:", error);

        return false;
      }

      // Prepare data for API call
      const formData = { name: collectionName, bannerImage: imageUrl };
      console.log("Collection Form Data:", {
        name: formData.name,
        bannerImage: imageUrl.substring(0, 50) + "...",
      });

      let response;
      if (isEditMode && collectionId) {
        response = await updateCollection(collectionId, formData);
        console.log("Update API Response status:", response.status);
      } else {
        console.log("Sending data to createCollection");
        response = await createCollection(formData);
        console.log("Create API Response status:", response.status);
      }

      console.log(
        `Collection ${isEditMode ? "updated" : "created"} successfully`
      );
      navigate("/collections");
      return true;
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} collection:`,
        error
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("Form submission cancelled");
    resetForm();
    navigate("/collections");
  };

  if (loading || uploadInProgress) {
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
            if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 15) {
              setCollectionName(value);
              if (value.trim() && errors.collectionName) {
                setErrors({ ...errors, collectionName: "" });
              }
            } else if (value.length > 15) {
              setErrors({
                ...errors,
                collectionName: "Collection name must not exceed 15 characters",
              });
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
            width: "300px",
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
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle1" gutterBottom align="left">
              Collection Images
            </Typography>
            <Tooltip
              title="Press on image to add products to collection"
              arrow
              placement="right"
            >
              <InfoOutlined
                sx={{
                  ml: 1,
                  fontSize: 18,
                  color: "primary.main",
                  cursor: "help",
                }}
              />
            </Tooltip>
          </Box>
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
            <ImageSelection
              images={images}
              setImages={setImages}
              type="collection"
            />
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
    </Box>
  );
};

export default CollectionForm;
