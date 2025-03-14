
import { Box, Button } from "@mui/material";

const ActionBox = () => {
  const handleCancel = () => {
    console.log("Form cancelled");
  };

  const handleSubmit = () => {
    console.log("Form submitted");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        width: "100%",
      }}
    >
      <Button
        variant="outlined"
        onClick={handleCancel}
        sx={{
          borderColor: "grey.500",
          color: "grey.700",
          "&:hover": {
            borderColor: "grey.700",
            backgroundColor: "grey.50",
          },
        }}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{
          bgcolor: "var(--secondary-color, #4CAF50)",
          color: "white",
          "&:hover": {
            bgcolor: "var(--secondary-dark-color, #388E3C)",
          },
        }}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default ActionBox;
