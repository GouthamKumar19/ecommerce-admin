// ImageSelection.tsx
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CropIcon from "@mui/icons-material/Crop";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageCropper from "./ImageCrop";
import ImagePopup from "./ImagePopup";
import ImageUploader from "./ImageUploader";
import "yet-another-react-lightbox/styles.css";

// Types
export interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface ImageSelectionProps {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

interface ImageBoxProps {
  image: ProductImage;
  onCrop: (url: string, id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onToggle: (id: number) => void;
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
  onToggle,
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
        top: 8,
        right: 8,
        backgroundColor: "#4CAF50",
        color: "white",
        borderRadius: "50%",
        width: 24,
        height: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(image.id);
      }}
    >
      <CheckCircleOutlineIcon fontSize="small" />
    </Box>

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
}) => {
  // State
  const [cropOpen, setCropOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  // Derived state
  const selectedImages = images.filter((img) => img.selected);
  const firstRow = selectedImages.slice(0, IMAGES_PER_ROW);
  const secondRow = selectedImages.slice(IMAGES_PER_ROW, MAX_IMAGES);

  // Handlers
  const handleCropComplete = (croppedImageUrl: string) => {
    if (currentImageId !== null) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === currentImageId ? { ...img, url: croppedImageUrl } : img
        )
      );
    } else {
      const newImage: ProductImage = {
        id: Date.now(),
        url: croppedImageUrl,
        selected: true,
      };
      setImages((prev) => [...prev, newImage]);
    }

    setCropOpen(false);
    setCurrentImage(null);
    setCurrentImageId(null);
  };

  const openCropDialog = (imageUrl: string, imageId: number) => {
    setCurrentImage(imageUrl);
    setCurrentImageId(imageId);
    setCropOpen(true);
  };

  const toggleImageSelection = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  const deleteImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const openImagePopup = (imageUrl: string) => {
    setPopupImage(imageUrl);
    setPopupOpen(true);
  };

  const closeImagePopup = () => {
    setPopupOpen(false);
    setPopupImage(null);
  };

  const handleFileUpload = (fileUrl: string) => {
    setCurrentImage(fileUrl);
    setCurrentImageId(null);
    setCropOpen(true);
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
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
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
                onDelete={deleteImage}
                onToggle={toggleImageSelection}
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
                  onDelete={deleteImage}
                  onToggle={toggleImageSelection}
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
        type="product"
      />

      {/* Image Popup */}
      <ImagePopup
        open={popupOpen}
        imageUrl={popupImage}
        onClose={closeImagePopup}
        allImages={selectedImages}
      />
    </Box>
  );
};

export default ImageSelection;
