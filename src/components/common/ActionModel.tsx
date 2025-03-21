import React, { useContext } from "react";
import { Box, Button } from "@mui/material";
import { ActionContext } from "../../context/ActionContext";

interface ActionBoxProps {
  cancelText?: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ActionBox: React.FC<ActionBoxProps> = ({
  cancelText = "Cancel",
  confirmText = "Confirm",
  isLoading = false,
}) => {
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
        disabled={isLoading}
        sx={{
          color: "var(--secondary-color)",
          borderColor: "var(--secondary-color)",
          textTransform: "uppercase",
          minWidth: "96px",
        }}
        onClick={actionHandlers.onCancel}
      >
        {cancelText}
      </Button>
      <Button
        variant="contained"
        disabled={isLoading}
        sx={{
          bgcolor: "var(--secondary-color)",
          textTransform: "uppercase",
          minWidth: "96px",
        }}
        onClick={actionHandlers.onConfirm}
      >
        {confirmText}
      </Button>
    </Box>
  );
};

export default ActionBox;
