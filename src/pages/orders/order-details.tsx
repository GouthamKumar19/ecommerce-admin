import { Box } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrdersForm from "../../components/OrdersForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { getOrderById } from "../../api/orders"; // Import your API function
import { OrderNew } from "../../types/orders.types";
import { ActionContext } from "../../context/ActionContext";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { setActionHandlers } = useContext(ActionContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get order ID from URL params
  const [order, setOrder] = useState<OrderNew | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>();
  const [paymentStatus, setPaymentStatus] = useState<string>();

  useEffect(() => {
    // Check if we're in edit mode
    if (id && id !== "new") {
      setIsEdit(true);
    }
  }, [id]);

  useEffect(() => {
    // Set up action handlers for the ActionBox component
    setActionHandlers({
      onConfirm: handleSave,
      onCancel: handleCancel,
    });

    // Cleanup function to reset handlers when component unmounts
    return () => {
      setActionHandlers({
        onConfirm: () => console.warn("onConfirm is not implemented"),
        onCancel: () => console.warn("onCancel is not implemented"),
      });
    };
  }, [setActionHandlers, orderStatus, paymentStatus]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (id) {
          const response = await getOrderById(id);
          console.log("Order details:", response.data.tableData[0]);
          setOrder(response.data.tableData[0]);
          setOrderStatus(response.data.tableData[0].status);
          setPaymentStatus(response.data.tableData[0].paymentDetails.status);
        }
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log("Form submitted with:", {
        orderId: id,
        orderStatus,
        paymentStatus,
      });

      // Simulate successful operation
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Order updated successfully");
        navigate("/orders");
      }, 500);
    } catch (error) {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        borderRadius: "8px",
      }}
    >
      {/* Top section - fixed */}
      <Box
        sx={{
          padding: 2,
          boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <BackArrow />
      </Box>

      {/* Middle section - scrollable with padding at bottom to prevent content overlap */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          paddingBottom: "80px", // Add extra padding at the bottom to prevent overlap
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Opera
          },
        }}
      >
        {loading ? (
          <div className="p-4">Loading order data...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : order ? (
          <OrdersForm order={order} setOrderStatus={setOrderStatus} setPaymentStatus={setPaymentStatus} />
        ) : (
          <div className="p-4">Order not found</div>
        )}
      </Box>

      {/* Bottom section with ActionBox component */}
      <Box
        sx={{
          padding: 3, // Increased padding
          paddingBottom: 4, // Extra bottom padding
          boxShadow: "0px -2px 4px rgba(0,0,0,0.05)",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          bgcolor: "white",
        }}
      >
        <ActionBox
          cancelText="Cancel"
          confirmText={isEdit ? "Update" : "Add"}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default OrderDetails;