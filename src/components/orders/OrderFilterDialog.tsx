import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  TextField,
} from "@mui/material";

interface OrderFilterDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: {
    paymentStatus: string;
    orderStatus: string;
    date: string;
  }) => void;
}

const OrderFilterDialog: React.FC<OrderFilterDialogProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

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
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}
          >
            <InputLabel>Payment Status</InputLabel>
            <Select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as string)}
              label="Payment Status"
            >
              <MenuItem value="">All Orders</MenuItem>
              <MenuItem value="Complete">Complete</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Failed">Failed</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{ bgcolor: "#f5f5f5", borderRadius: 2 }}
          >
            <InputLabel>Order Status</InputLabel>
            <Select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as string)}
              label="Order Status"
            >
              <MenuItem value="">All Orders</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
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
