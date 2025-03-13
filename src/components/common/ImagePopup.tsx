import React from "react";
import { Dialog, DialogContent, Box } from "@mui/material";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImagePopupProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ open, imageUrl, onClose }) => {
  // Using lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);

  React.useEffect(() => {
    // Open lightbox when the dialog is opened
    if (open && imageUrl) {
      setLightboxOpen(true);
    } else {
      setLightboxOpen(false);
    }
  }, [open, imageUrl]);

  // Handle lightbox close
  const handleLightboxClose = () => {
    setLightboxOpen(false);
    onClose();
  };

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
      {imageUrl && (
        <Lightbox
          open={lightboxOpen}
          close={handleLightboxClose}
          slides={[{ src: imageUrl }]}
          plugins={[Zoom, Thumbnails]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 1.2,
          }}
          thumbnails={{
            position: "bottom",
            width: 120,
            height: 80,
          }}
          carousel={{
            finite: true,
          }}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.9)" },
            thumbnailsContainer: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
          }}
        />
      )}
    </>
  );
};

export default ImagePopup;
