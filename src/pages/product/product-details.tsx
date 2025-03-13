
import ProductForm from "../../components/Product/ProductForm"; // Adjust the path as necessary
import ArrowBackButton from "../../components/common/ArrowBackButton"; // Ensure this path is correct
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const ProductDetails = () => {
  const navigate = useNavigate(); // Use navigate for handling back

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow max-h-screen example">
      <div
        style={{
          display: "flex", // Change to flex to align items horizontally
          justifyContent: "flex-start", // Align items to the start (left)
          alignItems: "center", // Center items vertically
          background: "white",
          marginBottom: "20px",
        }}
      >
        {/* Container for back button and title */}
        <div
          style={{
            display: "flex", // Flex for horizontal alignment
            alignItems: "center", // Center items vertically
            width: "100%", // Full width
          }}
        >
          <ArrowBackButton onClick={handleCancel} />
          <p
            style={{
              color: "#0d7f3f",
              marginLeft: "10px", // Space between button and text
              fontSize: "20px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              marginTop: "-9px", // Align with the back button
            }}
          >
            ADD PRODUCT
          </p>
        </div>
      </div>
      <ProductForm /> {/* Form for adding or editing products */}
    </div>
  );
};

export default ProductDetails;
