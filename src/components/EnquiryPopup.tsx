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
  Divider,
} from "@mui/material";
import { Close as CloseIcon, Person, Message } from "@mui/icons-material";
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
      maxWidth="sm"
      aria-labelledby="enquiry-popup-title"
      PaperProps={{
        sx: {
          maxHeight: "80vh",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        id="enquiry-popup-title"
        sx={{
          backgroundColor: "#0d7f3f",
          color: "white",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="600" sx={{ letterSpacing: 0.5 }}>
          Enquiry Details
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "white",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "rotate(90deg)",
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ padding: 0, backgroundColor: "#f9f9f9" }}>
        <Box sx={{ p: 3, pt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person sx={{ color: "#0d7f3f", mr: 1.5 }} />
                  <Typography variant="subtitle1" fontWeight="600" color="#333">
                    Customer Information
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight="500" color="#555" gutterBottom>
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    value={enquiry.name}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        backgroundColor: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0,0,0,0.12)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0,0,0,0.12) !important",
                          borderWidth: "1px !important",
                        },
                      },
                    }}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" fontWeight="500" color="#555" gutterBottom>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    value={enquiry.email}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        backgroundColor: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0,0,0,0.12)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "rgba(0,0,0,0.12) !important",
                          borderWidth: "1px !important",
                        },
                      },
                    }}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1.5,
                      },
                    }}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Message sx={{ color: "#0d7f3f", mr: 1.5 }} />
                  <Typography variant="subtitle1" fontWeight="600" color="#333">
                    Enquiry Message
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  maxRows={6}
                  value={enquiry.message}
                  InputProps={{
                    readOnly: true,
                    sx: {
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0,0,0,0.12) !important",
                        borderWidth: "1px !important",
                      },
                    },
                  }}
                  sx={{
                    whiteSpace: "pre-wrap",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </Grid>
              
              {/* Removed the date display that was here */}
            </Grid>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EnquiryPopup;
