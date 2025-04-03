import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CropIcon from "@mui/icons-material/Crop";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageCropper from "./ImageCrop";
import ImagePopup from "./ImagePopup";
import ImageUploader from "./ImageUploader";
import ConfirmationDialog from "./Dialog"; // Importing the ConfirmationDialog
import "yet-another-react-lightbox/styles.css";
import { getPresignedUrl, uploadFile } from "../../api/collectionImage";
// Types
export interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

type ImageType = "product" | "general" | "collection" |"category" | undefined; // Update the type to include "collection"

interface ImageSelectionProps {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
  type: ImageType; // Use the updated ImageType
}

interface ImageBoxProps {
  image: ProductImage;
  onCrop: (url: string, id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onImageClick: (url: string) => void;
}

// Constants
const MAX_IMAGES = 10;
const IMAGES_PER_ROW = 5;

// ImageBox component
const ImageBox: React.FC<ImageBoxProps> = ({
  image,
  onCrop,
  onDelete,
  onImageClick,
}) => (
  <Box
    sx={{
      position: "relative",
      borderRadius: 2,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      width: 140,
      height: 140,
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      },
    }}
    onClick={() => onImageClick(image.url)}
  >
    <img
      src={image.url}
      alt="Product"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />

    <Box
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        padding: "4px 8px",
      }}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onCrop(image.url, image.id);
        }}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "#4CAF50" },
        }}
      >
        <CropIcon fontSize="small" />
      </Box>

      <Box
        onClick={(e) => onDelete(image.id, e)}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          "&:hover": { color: "#f44336" },
        }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </Box>
    </Box>
  </Box>
);

// Main component
const ImageSelection: React.FC<ImageSelectionProps> = ({
  images,
  setImages,
  type,
}) => {
  // State
  const [cropOpen, setCropOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

  // Derived state
  const selectedImages = images.filter((img) => img.selected);
  const firstRow = selectedImages.slice(0, IMAGES_PER_ROW);
  const secondRow = selectedImages.slice(IMAGES_PER_ROW, MAX_IMAGES);

  // Handlers
  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      // Create a file from the blob
      const fileName = `image_${Date.now()}.jpg`;
      const fileType = "image/jpeg";
      const imageFile = new File([croppedImageBlob], fileName, {
        type: fileType,
      });

      // Get the presigned URL for upload
      const typeFolder = type || "general"; // Use the type prop or default to "general"
      const presignedUrl = await getPresignedUrl(fileName, typeFolder);
      console.log(presignedUrl, "PRESIGNEDURL");
      // Upload the file
      await uploadFile(presignedUrl, imageFile);
      
      // Create a local URL for preview while waiting for server response
      const reader = new FileReader();
      reader.onload = (e) => {
        const croppedImageUrl = e.target?.result as string;

        if (currentImageId !== null) {
          // Update existing image
          setImages((prev) =>
            prev.map((img) =>
              img.id === currentImageId ? { ...img, url: croppedImageUrl } : img
            )
          );
        } else {
          // Add new image
          const newImage: ProductImage = {
            id: Date.now(),
            url: croppedImageUrl,
            selected: true,
          };
          setImages((prev) => [...prev, newImage]);
        }
      };
      reader.readAsDataURL(croppedImageBlob);

      // Reset states
      setCropOpen(false);
      setCurrentImage(null);
      setCurrentImageId(null);

      // Optional: show success message to user
      // You can add a toast notification here
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error - show error message to user
      // You can add a toast notification here
    }
  };

  const openCropDialog = (imageUrl: string, imageId: number) => {
    setCurrentImage(imageUrl);
    setCurrentImageId(imageId);
    setCropOpen(true);
  };

  const confirmDeleteImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageToDelete(id);
    setDialogOpen(true);
  };

  const deleteImage = (confirm: boolean) => {
    if (confirm && imageToDelete !== null) {
      setImages((prev) => prev.filter((img) => img.id !== imageToDelete));
    }
    setDialogOpen(false);
    setImageToDelete(null);
  };

  const openImagePopup = (imageUrl: string) => {
    setPopupImage(imageUrl);
    setPopupOpen(true);
  };

  const closeImagePopup = () => {
    setPopupOpen(false);
    setPopupImage(null);
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;
      setCurrentImage(fileUrl);
      setCurrentImageId(null);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Render
  return (
    <Box sx={{ width: "100%" }}>
      {/* Image Uploader Component */}
      <ImageUploader
        currentCount={images.length}
        maxImages={MAX_IMAGES}
        onFileUpload={handleFileUpload}
      />

      {/* Selected Images Gallery */}
      {selectedImages.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: "semibold", fontSize: "1.25rem" }}
          >
            Selected Images
          </Typography>

          {/* First Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              mb: 2,
              justifyContent: "center",
            }}
          >
            {firstRow.map((image) => (
              <ImageBox
                key={image.id}
                image={image}
                onCrop={openCropDialog}
                onDelete={confirmDeleteImage}
                onImageClick={openImagePopup}
              />
            ))}
          </Box>

          {/* Second Row */}
          {secondRow.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 4,
                justifyContent: "center",
              }}
            >
              {secondRow.map((image) => (
                <ImageBox
                  key={image.id}
                  image={image}
                  onCrop={openCropDialog}
                  onDelete={confirmDeleteImage}
                  onImageClick={openImagePopup}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Image Cropper */}
      <ImageCropper
        open={cropOpen}
        onClose={() => {
          setCropOpen(false);
          setCurrentImage(null);
        }}
        imageUrl={currentImage}
        onCropComplete={handleCropComplete}
        type={type} // Pass the type prop here
      />

      {/* Image Popup */}
      <ImagePopup
        open={popupOpen}
        imageUrl={popupImage}
        onClose={closeImagePopup}
        allImages={selectedImages}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={dialogOpen}
        title="Delete Image"
        subtitle="Are you sure you want to delete this image?"
        onClose={deleteImage}
      />
    </Box>
  );
};

export default ImageSelection;
