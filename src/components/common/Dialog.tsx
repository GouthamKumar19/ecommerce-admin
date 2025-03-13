import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  subtitle: string;
  onClose: (confirm: boolean) => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  subtitle,
  onClose,
}) => {
  const handleYes = () => {
    onClose(true);
  };

  const handleNo = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{subtitle}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={handleNo} style={{ color: "#0d7f3f" }}>
          No
        </Button>
        <Button onClick={handleYes} style={{ color: "#0d7f3f" }} autoFocus>
          Yes
        </Button> */}
        <Button
          variant="outlined"
          onClick={handleNo}
          sx={{
            borderColor: "grey.500",
            color: "grey.700",
            "&:hover": {
              borderColor: "grey.700",
              backgroundColor: "grey.50",
            },
          }}
        >
          NO
        </Button>

        <Button
          variant="contained"
          onClick={handleYes}
          sx={{
            bgcolor: "var(--secondary-color, #4CAF50)",
            color: "white",
            "&:hover": {
              bgcolor: "var(--secondary-dark-color, #388E3C)",
            },
          }}
        >
          YES
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
