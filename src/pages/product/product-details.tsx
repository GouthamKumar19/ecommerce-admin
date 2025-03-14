
import { Box } from "@mui/material";
import ProductForm from "../../components/Product/ProductForm";
import BackArrow from "../../components/common/BackArrow";
import ActionBox from "../../components/common/ActionModel";

export const ProductDetails = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        // Add border
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
        <ProductForm />
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

export default ProductDetails;
