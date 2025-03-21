import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { ActionContext } from "../../context/ActionContext";
const ActionBox: React.FC = () => {
  const { actionHandlers } = useContext(ActionContext);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          color: "var(--secondary-color)", // Use the CSS variable for text color
          borderColor: "var(--secondary-color)", // Use the CSS variable for border color
        }}
        onClick={actionHandlers.onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        sx={{
          bgcolor: "var(--secondary-color)", // Use the CSS variable for border color
        }}
        onClick={actionHandlers.onConfirm}
      >
        Confirm
      </Button>
    </Box>
  );
};

export default ActionBox;
