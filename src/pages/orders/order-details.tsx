// In order-details.tsx
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using react-router
import OrdersForm from "../../components/OrdersForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { getOrderById } from "../../api/orders"; // Import your API function
import { OrderNew } from "../../types/orders.types";


const OrderDetails = () => {
  const { id } = useParams(); // Get order ID from URL params
  const [order, setOrder] = useState<OrderNew| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (id) {
          const response = await getOrderById(id);
          console.log("Order details:", response.data.tableData[0]);
          setOrder(response.data.tableData[0]);
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
          <OrdersForm order={order} />
        ) : (
          <div className="p-4">Order not found</div>
        )}
      </Box>

      {/* Bottom section - fixed with increased bottom spacing */}
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
        <ActionBox />
      </Box>
    </Box>
  );
};

export default OrderDetails;
