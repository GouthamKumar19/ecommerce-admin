// ImageUploader.tsx
import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Box, Typography, Button, Paper, Tooltip } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ImageUploaderProps {
  currentCount: number;
  maxImages: number;
  onFileUpload: (fileUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentCount,
  maxImages,
  onFileUpload,
}) => {
  // State
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const isMaxImagesReached = currentCount >= maxImages;

  // Handlers
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

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (isMaxImagesReached) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (isMaxImagesReached) return;

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      onFileUpload(fileUrl);
    }
  };

  const openFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMaxImagesReached && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: "background.default",
          borderRadius: 2,
          width: "70%",
          maxWidth: "800px",
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
          <Tooltip
              title=" You can upload up to 10 images"
              arrow
            >
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
            </Tooltip>
          <Typography
            variant="caption"
            color="textSecondary"
            align="center"
            sx={{ mt: 2 }}
          >
            {`${currentCount}/${maxImages} images uploaded • Supported formats: JPG, PNG, GIF`}
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
    </Box>
  );
};

export default ImageUploader;
