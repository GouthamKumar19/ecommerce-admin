import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CropIcon from "@mui/icons-material/Crop";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageCropper from "./ImageCrop";
import ImagePopup from "./ImagePopup";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface ImageSelectionProps {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

const MAX_IMAGES = 10;
const IMAGES_PER_ROW = 5;

const ImageSelection: React.FC<ImageSelectionProps> = ({
  images,
  setImages,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropping states
  const [cropOpen, setCropOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);

  // Popup state
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupImage, setPopupImage] = useState<string | null>(null);

  // Check if maximum images limit is reached
  const isMaxImagesReached = images.length >= MAX_IMAGES;

  // Handle drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isMaxImagesReached) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isMaxImagesReached) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isMaxImagesReached) return;

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Process files and open the cropper
  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentImage(fileUrl);
      setCurrentImageId(null);
      setCropOpen(true);
    }
  };

  // Open cropping dialog for existing image
  const openCropDialog = (imageUrl: string, imageId: number) => {
    setCurrentImage(imageUrl);
    setCurrentImageId(imageId);
    setCropOpen(true);
  };

  // Handle crop completion
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

  // Toggle image selection
  const toggleImageSelection = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img
      )
    );
  };

  // Delete image
  const deleteImage = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Open image popup
  const openImagePopup = (imageUrl: string) => {
    setPopupImage(imageUrl);
    setPopupOpen(true);
  };

  // Close image popup
  const closeImagePopup = () => {
    setPopupOpen(false);
    setPopupImage(null);
  };

  // Get selected images
  const selectedImages = images.filter((img) => img.selected);

  // Split images into rows
  const firstRow = selectedImages.slice(0, IMAGES_PER_ROW);
  const secondRow = selectedImages.slice(IMAGES_PER_ROW, MAX_IMAGES);

  // Trigger file input click
  const openFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMaxImagesReached && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Drag & Drop Upload Area */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Box
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: `2px dashed ${dragActive ? "#4CAF50" : "#d0d0d0"}`,
            borderRadius: 2,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: dragActive
              ? "rgba(76, 175, 80, 0.05)"
              : "transparent",
            cursor: isMaxImagesReached ? "not-allowed" : "pointer",
            opacity: isMaxImagesReached ? 0.7 : 1,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              borderColor: isMaxImagesReached ? "#d0d0d0" : "#4CAF50",
              backgroundColor: isMaxImagesReached
                ? "transparent"
                : "rgba(76, 175, 80, 0.05)",
            },
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 48,
              color: dragActive ? "#4CAF50" : "#757575",
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            gutterBottom
            color={dragActive ? "primary" : "textPrimary"}
          >
            {isMaxImagesReached
              ? "Maximum images limit reached"
              : "Drag & Drop Product Images Here"}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mb: 2 }}
          >
            or
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={openFileInput}
            disabled={isMaxImagesReached}
            sx={{
              px: 3,
              py: 1,
              textTransform: "none",
              borderRadius: 1.5,
              backgroundColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "#3b8a3e",
              },
              "&.Mui-disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
              },
            }}
          >
            {isMaxImagesReached ? "Maximum Limit Reached" : "Browse Files"}
          </Button>
          <Typography
            variant="caption"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            {`${images.length}/${MAX_IMAGES} images uploaded • Supported formats: JPG, PNG, GIF`}
          </Typography>
        </Box>

        {/* Hidden file input */}
        <input
          type="file"
          onChange={handleFileInput}
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
        />
      </Paper>

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
              ml: 14,
              mb: 2,
              justifyContent: "flex-start",
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
                ml: 14,
                justifyContent: "flex-start",
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
      />
    </Box>
  );
};

// ImageBox component for better organization
interface ImageBoxProps {
  image: ProductImage;
  onCrop: (url: string, id: number) => void;
  onDelete: (id: number, e: React.MouseEvent) => void;
  onToggle: (id: number) => void;
  onImageClick: (url: string) => void;
}

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
      onClick={() => onToggle(image.id)}
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

export default ImageSelection;
