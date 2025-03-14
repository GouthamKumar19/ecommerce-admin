import React from "react";
import { Dialog, DialogContent, Box } from "@mui/material";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ProductImage {
  id: number;
  url: string;
  selected: boolean;
}

interface ImagePopupProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
  allImages?: ProductImage[]; // Optional array of all images for navigation
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  open,
  imageUrl,
  onClose,
  allImages = [],
}) => {
  // Using lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [initialIndex, setInitialIndex] = React.useState(0);

  React.useEffect(() => {
    // Open lightbox when the dialog is opened
    if (open && imageUrl) {
      setLightboxOpen(true);

      // Find the index of the current image in the allImages array
      if (allImages.length > 0) {
        const index = allImages.findIndex((img) => img.url === imageUrl);
        setInitialIndex(index !== -1 ? index : 0);
      }
    } else {
      setLightboxOpen(false);
    }
  }, [open, imageUrl, allImages]);

  // Handle lightbox close
  const handleLightboxClose = () => {
    setLightboxOpen(false);
    onClose();
  };

  // Prepare slides for the lightbox
  const slides =
    allImages.length > 0
      ? allImages.map((image) => ({ src: image.url }))
      : imageUrl
        ? [{ src: imageUrl }]
        : [];

  // Get appropriate lightbox configuration based on number of images
  const getLightboxConfig = () => {
    const totalImages = slides.length;

    // Base configuration that applies to all cases
    const baseConfig = {
      plugins: [Zoom, Thumbnails],
      zoom: {
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 1.2,
      },
      carousel: {
        finite: false, // Allow looping through images
      },
      styles: {
        container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
        thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
      },
    };

    if (totalImages === 1) {
      // For a single image
      return {
        ...baseConfig,
        thumbnails: {
          position: "bottom" as const,
          width: 120,
          height: 80,
          imageFit: "contain" as const,
          vignette: false,
        },
        styles: {
          ...baseConfig.styles,
          thumbnailsTrack: { maxWidth: "120px", margin: "0 auto" },
        },
      };
    } else if (totalImages === 2) {
      // Special case for exactly 2 images
      return {
        ...baseConfig,
        thumbnails: {
          position: "bottom" as const,
          width: 120,
          height: 80,
          imageFit: "contain" as const,
          vignette: false,
          visibleItems: 2, // Show exactly 2 thumbnails
        },
        styles: {
          ...baseConfig.styles,
          thumbnailsTrack: {
            maxWidth: "240px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "10px", // Add spacing between thumbnails
          },
          thumbnail: {
            opacity: 1, // Make all thumbnails fully visible
            border: "2px solid transparent",
            transition: "border-color 0.3s",
            borderRadius: "4px",
            overflow: "hidden",
            width: "120px", // Ensure each thumbnail has a fixed width
            height: "80px", // Ensure each thumbnail has a fixed height
          },
          thumbnailActive: {
            border: "2px solid white", // Highlight the active thumbnail
          },
        },
      };
    } else {
      // For 3+ images
      return {
        ...baseConfig,
        thumbnails: {
          position: "bottom" as const,
          width: 120,
          height: 80,
          imageFit: "contain" as const,
          vignette: false,
          visibleItems: 3, // Show 3 thumbnails at a time
        },
        styles: {
          ...baseConfig.styles,
          thumbnailsTrack: { maxWidth: "360px", margin: "0 auto" },
        },
      };
    }
  };

  // Get the configuration based on number of images
  const config = getLightboxConfig();

  return (
    <>
      {/* Use Dialog just to handle the modal state */}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        PaperProps={{
          style: { backgroundColor: "transparent", boxShadow: "none" },
        }}
      >
        {/* Empty DialogContent - we'll use Lightbox instead */}
        <DialogContent sx={{ padding: 0 }}>
          <Box sx={{ display: "none" }}>{/* This is just a placeholder */}</Box>
        </DialogContent>
      </Dialog>

      {/* Lightbox component */}
      {(imageUrl || allImages.length > 0) && (
        <Lightbox
          open={lightboxOpen}
          close={handleLightboxClose}
          slides={slides}
          index={initialIndex}
          plugins={config.plugins}
          zoom={config.zoom}
          thumbnails={config.thumbnails}
          carousel={config.carousel}
          styles={config.styles}
        />
      )}
    </>
  );
};

export default ImagePopup;
