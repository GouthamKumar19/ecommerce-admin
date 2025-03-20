import { Box } from "@mui/material";
import OrdersForm from "../../components/OrdersForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";
import { useEffect } from "react";
import { mockOrders} from "../../config/mock/ordersData";
// import { Order } from "../../types/order.types";

const OrderDetails = () => {
  // const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // const response = await getOrderById("66b3279c39c21f7342c125b4");
        // setOrder(response.data);
        // setOrder(response.data);
        console.log("Order fetched:", mockOrders);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, []);

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
        <OrdersForm  />
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
