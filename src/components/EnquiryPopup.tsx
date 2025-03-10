import React from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Chip,
  Stack
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

interface EnquiryPopupProps {
  data: {
    [key: string]: unknown;
  };
}

const EnquiryPopup: React.FC<EnquiryPopupProps> = ({ data }) => {
  // Function to format field names from camelCase
  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // Function to determine if a value should be displayed as a special element
  const renderValue = (value: unknown) => {
    if (value === null || value === undefined) {
      return <Chip size="small" label="N/A" color="default" variant="outlined" />;
    } else if (typeof value === "boolean") {
      return (
        <Chip
          size="small"
          label={value ? "Yes" : "No"}
          color={value ? "success" : "error"}
        />
      );
    } else if (typeof value === "string" && value.includes("@")) {
      // Special handling for email fields
      return (
        <Typography
          variant="body2"
          component="span"
          color="primary"
          sx={{ fontWeight: "medium" }}
        >
          {value}
        </Typography>
      );
    } else if (typeof value === "string" && (value.startsWith("http") || value.startsWith("www"))) {
      // Special handling for URLs
      return (
        <a href={value.toString()} target="_blank" rel="noopener noreferrer">
          {value.toString()}
        </a>
      );
    } else {
      return String(value);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 500,
        maxHeight: "80vh",
        overflow: "auto",
        position: "relative",
        borderRadius: 2,
        p: 3,
      }}
    >
      {/* Simple header with only info icon and title */}
      <Box display="flex" alignItems="center" mb={2}>
        <InfoOutlinedIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2" color="primary.main" fontWeight="bold">
          Enquiry Information
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Content */}
      <Stack spacing={2}>
        {Object.entries(data).map(([key, value]) => {
          // Skip rendering the id key or any internal keys that start with underscore
          if (key === "id" || key.startsWith("_") || key === "actions") {
            return null;
          }

          return (
            <Box key={key} sx={{ pb: 1 }}>
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                fontWeight="medium"
                sx={{ mb: 0.5 }}
              >
                {formatFieldName(key)}
              </Typography>
              <Typography variant="body2">{renderValue(value)}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default EnquiryPopup;