import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  TextField,
} from "@mui/material";

interface OrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    paymentStatus: string[];
    orderStatus: string[];
    date: string;
  }) => void;
}

const OrderFilterDialog: React.FC<OrderFilterDialogProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<string[]>([]);
  const [orderStatus, setOrderStatus] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPaymentStatus((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleOrderChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const value = event.target.value;
    setOrderStatus((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleApply = () => {
    onApply({ paymentStatus, orderStatus, date: selectedDate });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ color: "var(--secondary-color)" }}
        >
          Filter Orders
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <FormControl component="fieldset">
            <Typography variant="h6">Payment Status</Typography>
            <Box>
              {["Complete", "Pending", "Failed"].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      value={status}
                      onChange={handlePaymentChange}
                      sx={{
                        "&.Mui-checked": {
                          color: "var(--secondary-color)", // Set the checkmark color
                        },
                      }}
                    />
                  }
                  label={status}
                />
              ))}
            </Box>
          </FormControl>
          <FormControl component="fieldset">
            <Typography variant="h6">Order Status</Typography>
            <Box>
              {[
                "Shipped",
                "Order Placed",
                "Processing",
                "Order Confirmed",
                "Delivered",
                "Cancelled",
                "Ready To Ship",
              ].map((status) => (
                <FormControlLabel
                  key={status}
                  control={
                    <Checkbox
                      value={status}
                      onChange={handleOrderChange}
                      sx={{
                        "&.Mui-checked": {
                          color: "var(--secondary-color)", // Set the checkmark color
                        },
                      }}
                    />
                  }
                  label={status}
                />
              ))}
            </Box>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{ px: 3, pb: 2, display: "flex", justifyContent: "space-between" }}
      >
        <TextField
          type="date"
          variant="outlined"
          size="small"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              color: "green",
              borderColor: "green",
            },
          }}
        />
        <Box>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              color: "var(--secondary-color)",
              borderColor: "var(--secondary-color)",
              borderRadius: 2,
            }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--secondary-color)",
              color: "#ffffff",
              borderRadius: 2,
              ml: 2,
            }}
            onClick={handleApply}
          >
            APPLY
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderFilterDialog;
