import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Slider,
  Grid,
  IconButton,
} from "@mui/material";
import ReactCrop, { Crop, PixelCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  onCropComplete: (croppedImageUrl: string) => void;
  type?: "product" | "general"; // Add type prop
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  let cropWidth = 90;
  let cropHeight = cropWidth / aspect;

  if (cropHeight > 90) {
    cropHeight = 90;
    cropWidth = cropHeight * aspect;
  }

  return makeAspectCrop(
    {
      unit: "%",
      width: cropWidth,
      height: cropHeight,
      x: (100 - cropWidth) / 2,
      y: (100 - cropHeight) / 2,
    },
    aspect,
    mediaWidth,
    mediaHeight,
  );
}

const defaultCrop: Crop = {
  unit: "%",
  x: 25,
  y: 25,
  width: 50,
  height: 50,
};

const ImageCropper: React.FC<ImageCropperProps> = ({
  open,
  onClose,
  imageUrl,
  onCropComplete,
  type = "general", // Default to general
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>(defaultCrop);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [aspect, setAspect] = useState<number | undefined>(
    type === "product" ? 1 : 1,
  );
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setIsImageLoaded(false);
      setCrop(defaultCrop);
      // Set aspect to 1:1 for product type
      setAspect(type === "product" ? 1 : 1);
    }
  }, [open, type]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsImageLoaded(true);
    const { width, height } = e.currentTarget;

    if (aspect) {
      const newCrop = centerAspectCrop(width, height, aspect);
      setCrop(newCrop);
    } else {
      setCrop(defaultCrop);
    }
  };

  useEffect(() => {
    if (imgRef.current && isImageLoaded) {
      const { width, height } = imgRef.current;
      if (aspect) {
        const newCrop = centerAspectCrop(width, height, aspect);
        setCrop(newCrop);
      } else {
        setCrop(defaultCrop);
      }
    }
  }, [aspect, isImageLoaded]);

  const applyCrop = () => {
    if (imgRef.current && completedCrop && imageUrl) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };

      const rotated = rotation % 180 !== 0;
      canvas.width = rotated ? pixelCrop.height : pixelCrop.width;
      canvas.height = rotated ? pixelCrop.width : pixelCrop.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      const translationX = rotated ? -canvas.height / 2 : -canvas.width / 2;
      const translationY = rotated ? -canvas.width / 2 : -canvas.height / 2;
      ctx.translate(translationX, translationY);

      ctx.drawImage(
        imgRef.current,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      ctx.restore();

      const base64Image = canvas.toDataURL("image/jpeg", 0.95);
      onCropComplete(base64Image);
      onClose();
    }
  };

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const toggleAspect = () => {
    // For product type, we don't allow changing aspect ratio
    if (type === "product") return;

    const aspects = [1, 16 / 9, 4 / 3, undefined];
    const currentIndex = aspects.indexOf(aspect);
    const nextIndex = (currentIndex + 1) % aspects.length;
    setAspect(aspects[nextIndex]);
  };

  const getAspectRatioText = () => {
    if (aspect === 1) return "1:1";
    if (aspect === 16 / 9) return "16:9";
    if (aspect === 4 / 3) return "4:3";
    return "Free";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          height: "90vh",
          maxHeight: "900px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flex: 1,
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          Crop Image {type === "product" && "- 1:1 Ratio"}
        </Typography>

        {imageUrl && (
          <Box
            sx={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: 1,
              mb: 2,
              bgcolor: "#f5f5f5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f1f1",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "4px",
                  "&:hover": {
                    background: "#666",
                  },
                },
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                minWidth={50}
                minHeight={50}
                style={{
                  maxWidth: "100%",
                }}
              >
                <img
                  ref={imgRef}
                  src={imageUrl}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: "transform 0.3s ease",
                    objectFit: "contain",
                  }}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </Box>
          </Box>
        )}

        <Box sx={{ flexShrink: 0 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  Zoom:
                </Typography>
                <IconButton
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  size="small"
                >
                  <ZoomOutIcon />
                </IconButton>
                <Slider
                  value={zoom}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onChange={handleZoomChange}
                  aria-labelledby="zoom-slider"
                  sx={{ mx: 1 }}
                />
                <IconButton
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  size="small"
                >
                  <ZoomInIcon />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2">Rotate:</Typography>
                <Box>
                  <IconButton
                    onClick={() => setRotation((rot) => (rot - 90) % 360)}
                    size="small"
                  >
                    <RotateLeftIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => setRotation((rot) => (rot + 90) % 360)}
                    size="small"
                  >
                    <RotateRightIcon />
                  </IconButton>
                </Box>

                {/* Only show aspect ratio button for non-product images */}
                <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Aspect:
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={toggleAspect}
                    startIcon={<AspectRatioIcon />}
                    disabled={type === "product"}
                  >
                    {getAspectRatioText()}
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          flexShrink: 0,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          size="large"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={applyCrop}
          variant="contained"
          color="success"
          disabled={!completedCrop}
          size="large"
          sx={{ minWidth: 100 }}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCropper;
