import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
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

  const handlePaymentStatusChange = (status: string) => {
    setPaymentStatus((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const handleOrderStatusChange = (status: string) => {
    setOrderStatus((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const handleApply = () => {
    onApply({
      paymentStatus,
      orderStatus,
      date: selectedDate,
    });
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
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Payment Status
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentStatus.includes("Complete")}
                    onChange={() => handlePaymentStatusChange("Complete")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Complete"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentStatus.includes("Pending")}
                    onChange={() => handlePaymentStatusChange("Pending")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Pending"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentStatus.includes("Failed")}
                    onChange={() => handlePaymentStatusChange("Failed")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Failed"
              />
            </FormGroup>
          </Paper>

          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Order Status
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Order Placed")}
                    onChange={() => handleOrderStatusChange("Order Placed")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Order Placed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Order Confirmed")}
                    onChange={() => handleOrderStatusChange("Order Confirmed")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Order Confirmed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Processing")}
                    onChange={() => handleOrderStatusChange("Processing")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Processing"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Ready to Ship")}
                    onChange={() => handleOrderStatusChange("Ready to Ship")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Ready to Ship"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Shipped")}
                    onChange={() => handleOrderStatusChange("Shipped")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Shipped"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Delivered")}
                    onChange={() => handleOrderStatusChange("Delivered")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Delivered"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderStatus.includes("Cancelled")}
                    onChange={() => handleOrderStatusChange("Cancelled")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Cancelled"
              />
            </FormGroup>
          </Paper>
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
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              color: "var(--secondary-color)",
              borderColor: "var(--secondary-color)",
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
            Cancel
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
            Apply
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default OrderFilterDialog;
