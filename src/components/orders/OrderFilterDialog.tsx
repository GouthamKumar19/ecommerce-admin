import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from "@mui/material";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { format, startOfDay, endOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarToday } from "@mui/icons-material";

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
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  // State to control the popover
  const [calendarOpen, setCalendarOpen] = useState(false);

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

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // No API call here - only update the UI state
  };

  const handleApply = () => {
    let dateString = "";
    if (dateRange?.from && dateRange?.to) {
      // Convert dates to timestamps in milliseconds format for API as numbers
      const fromDate = startOfDay(dateRange.from).getTime();
      const toDate = endOfDay(dateRange.to).getTime();
      dateString = `${fromDate}|${toDate}`;
    }

    onApply({
      paymentStatus,
      orderStatus,
      date: dateString,
    });
    onClose();
  };

  const handleClear = () => {
    setPaymentStatus([]);
    setOrderStatus([]);
    setDateRange(undefined);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: "var(--secondary-color)" }}
          >
            Filter Orders
          </Typography>
          <Button
            onClick={handleClear}
            variant="outlined"
            sx={{
              color: "var(--secondary-color)",
              borderColor: "var(--secondary-color)",
              borderRadius: 2,
            }}
          >
            Clear
          </Button>
        </Box>
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
                    checked={paymentStatus.includes("Completed")}
                    onChange={() => handlePaymentStatusChange("Completed")}
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
                    checked={orderStatus.includes("Confirmed")}
                    onChange={() => handleOrderStatusChange("Confirmed")}
                    sx={{
                      color: "var(--secondary-color)",
                      "&.Mui-checked": {
                        color: "var(--secondary-color)",
                      },
                    }}
                  />
                }
                label="Confirmed"
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
        {/* Fixed Popover implementation */}
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outlined"
              sx={{
                color: "var(--secondary-color)",
                borderColor: "var(--secondary-color)",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {dateRange?.from ? (
                <>
                  {format(dateRange.from, "MMM dd, y")} -{" "}
                  {dateRange.to ? format(dateRange.to, "MMM dd, y") : ""}
                </>
              ) : (
                "SELECT DATE RANGE"
              )}{" "}
              <CalendarToday fontSize="small" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0"
            align="start"
            style={{ zIndex: 1400 }} // Ensure this z-index is higher than the dialog
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              className="flex"
              classNames={{
                day_selected:
                  "bg-[#0d7f3f] text-white hover:bg-[#0d7f3f] hover:text-white",
                day_today: "bg-[#0d7f3f] text-white",
                day_range_middle: "bg-[#0d7f3f]/20 text-gray-700",
                day_range_start: "bg-[#0d7f3f] text-white",
                day_range_end: "bg-[#0d7f3f] text-white",
              }}
            />
          </PopoverContent>
        </Popover>
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
