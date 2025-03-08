import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CropIcon from "@mui/icons-material/Crop";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface ImageSelectionProps {
  images: ProductImage[];
  setImages: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

const ImageSelection: React.FC<ImageSelectionProps> = ({
  images,
  setImages,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Cropping states
  const [cropOpen, setCropOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<number | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  // Handle drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process files
  const handleFiles = (files: FileList) => {
    const file = files[0]; // Get the first file for cropping
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setCurrentImage(fileUrl);
      setCurrentImageId(null); // New image
      setCropOpen(true);
    }
  };

  // Open cropping dialog for existing image
  const openCropDialog = (imageUrl: string, imageId: number) => {
    setCurrentImage(imageUrl);
    setCurrentImageId(imageId);
    setCropOpen(true);
  };

  // Apply crop and save image
  const applyCrop = () => {
    if (imgRef.current && completedCrop) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height,
        );

        // Convert to base64
        const base64Image = canvas.toDataURL("image/jpeg");

        if (currentImageId !== null) {
          // Update existing image
          setImages((prev) =>
            prev.map((img) =>
              img.id === currentImageId ? { ...img, url: base64Image } : img,
            ),
          );
        } else {
          // Add new image
          const newImage: ProductImage = {
            id: Date.now(),
            url: base64Image,
            selected: true,
          };
          setImages((prev) => [...prev, newImage]);
        }

        setCropOpen(false);
        setCurrentImage(null);
        setCurrentImageId(null);
      }
    }
  };

  // Toggle image selection
  const toggleImageSelection = (id: number) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, selected: !img.selected } : img,
      ),
    );
  };

  // Get selected images
  const selectedImages = images.filter((img) => img.selected);
  const selectedImagesCount = selectedImages.length;

  // Get unselected images
  // const unselectedImages = images.filter((img) => !img.selected);

  // Open file input when button is clicked
  const openFileInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Upload area with selected images */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 3,
          width: { xs: "95%", sm: "90%", md: "80%" },
          mx: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left side - Upload area */}
          <Box sx={{ display: "flex", flexDirection: "column", mr: 2 }}>
            <Box
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              sx={{
                border: "1px dashed #ccc",
                borderRadius: 1,
                p: 2,
                textAlign: "center",
                width: 160,
                height: 160,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: dragActive
                  ? "rgba(0, 0, 0, 0.05)"
                  : "transparent",
                cursor: "pointer",
                mb: 1,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: "#888" }} />
              <Typography variant="body1" gutterBottom>
                Drag and Drop here
              </Typography>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{ mt: 1 }}
                onClick={openFileInput}
              >
                ADD
              </Button>
              <input
                type="file"
                onChange={handleFileInput}
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
              />
            </Box>

            <Typography variant="body2" color="textSecondary" align="center">
              Select at least 4 images{" "}
              {selectedImagesCount > 0 && `(${selectedImagesCount} selected)`}
            </Typography>
          </Box>

          {/* Selected images displayed in columns of 5 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              maxHeight: 620,
              overflowY: "auto",
              flex: 1,
            }}
          >
            {Array.from({ length: Math.ceil(selectedImages.length / 5) }).map(
              (_, colIndex) => (
                <Box
                  key={`column-${colIndex}`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    mr: 2,
                  }}
                >
                  {selectedImages
                    .slice(colIndex * 5, (colIndex + 1) * 5)
                    .map((image) => (
                      <Box
                        key={image.id}
                        sx={{
                          position: "relative",
                          border: "2px solid #4CAF50",
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          width: 120,
                          height: 120,
                          mb: 1,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={image.url}
                          alt="Selected Product"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onClick={() => toggleImageSelection(image.id)}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "#4CAF50",
                            color: "white",
                            p: 0.5,
                          }}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            color: "white",
                            p: 0.5,
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openCropDialog(image.url, image.id);
                          }}
                        >
                          <CropIcon fontSize="small" />
                        </Box>
                      </Box>
                    ))}
                </Box>
              ),
            )}
          </Box>
        </Box>
      </Paper>

      {/* Image Cropping Dialog */}
      <Dialog
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {currentImage && (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
            >
              <img
                ref={imgRef}
                src={currentImage}
                style={{ maxWidth: "100%", maxHeight: "70vh" }}
                alt="Crop preview"
              />
            </ReactCrop>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={applyCrop} color="primary" variant="contained">
            Apply Crop
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageSelection;
