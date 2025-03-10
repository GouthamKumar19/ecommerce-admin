import React from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ImagePopupProps {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ open, imageUrl, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Selected"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImagePopup;
