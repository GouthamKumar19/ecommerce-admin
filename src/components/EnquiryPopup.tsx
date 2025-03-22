import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { Enquiry } from "../types/enquiry.types";

interface EnquiryPopupProps {
  open: boolean;
  onClose: () => void;
  enquiry: Enquiry | null;
}

const EnquiryPopup: React.FC<EnquiryPopupProps> = ({
  open,
  onClose,
  enquiry,
}) => {
  if (!enquiry) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Changed from "md" to "sm" to minimize width
      aria-labelledby="enquiry-popup-title"
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        id="enquiry-popup-title"
        sx={{
          backgroundColor: "#0d7f3f",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="500">
          Enquiry Information
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ padding: 3, marginTop: 1, backgroundColor: "white" }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 2.5,
            backgroundColor: "white",
            borderRadius: 1.5,
          }}
        >
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Name
                </Typography>
                <TextField
                  fullWidth
                  value={enquiry.name}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                      backgroundColor: "#ffffff",
                      width: "90%", // Reduced width for name field
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                      // Remove blue border on focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12) !important",
                        borderWidth: "1px !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  value={enquiry.email}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                      // Remove blue border on focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12) !important",
                        borderWidth: "1px !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box sx={{ width: { xs: "100%", sm: "90%" } }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={5}
                  value={enquiry.message}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                      // Remove blue border on focus
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12) !important",
                        borderWidth: "1px !important",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                  sx={{
                    whiteSpace: "pre-wrap",
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      "& > fieldset": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryPopup;
